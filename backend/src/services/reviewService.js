import prisma from '../config/database.js';

// In-memory fallback review store
const inMemoryReviews = new Map();
let reviewIdCounter = 1;

export const createReview = async ({ userId, productId, rating, comment }) => {
  const pId = parseInt(productId);
  const parsedRating = parseInt(rating);

  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    const error = new Error('Rating must be an integer between 1 and 5');
    error.status = 400;
    throw error;
  }

  if (!comment || comment.trim().length === 0) {
    const error = new Error('Comment is required');
    error.status = 400;
    throw error;
  }

  try {
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId: pId }
      }
    });

    if (existing) {
      const error = new Error('You have already submitted a review for this product');
      error.status = 400;
      throw error;
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId: pId,
        rating: parsedRating,
        comment: comment.trim()
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    });

    return review;
  } catch (dbErr) {
    if (dbErr.status) throw dbErr;

    const key = `${userId}_${pId}`;
    if (inMemoryReviews.has(key)) {
      const error = new Error('You have already submitted a review for this product');
      error.status = 400;
      throw error;
    }

    const review = {
      id: reviewIdCounter++,
      userId,
      productId: pId,
      rating: parsedRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      user: { id: userId, name: 'Reviewer' }
    };

    inMemoryReviews.set(key, review);
    return review;
  }
};

export const getProductReviews = async (productId) => {
  const pId = parseInt(productId);

  try {
    return await prisma.review.findMany({
      where: { productId: pId },
      include: {
        user: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (dbErr) {
    return Array.from(inMemoryReviews.values()).filter((r) => r.productId === pId);
  }
};

export const updateReview = async (reviewId, userId, { rating, comment }) => {
  const rId = parseInt(reviewId);

  try {
    const existing = await prisma.review.findUnique({ where: { id: rId } });
    if (!existing) {
      const error = new Error('Review not found');
      error.status = 404;
      throw error;
    }

    if (existing.userId !== userId) {
      const error = new Error('Forbidden: You can only edit your own reviews');
      error.status = 403;
      throw error;
    }

    return await prisma.review.update({
      where: { id: rId },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(comment && { comment: comment.trim() })
      }
    });
  } catch (dbErr) {
    if (dbErr.status) throw dbErr;
    for (const [key, review] of inMemoryReviews.entries()) {
      if (review.id === rId) {
        if (review.userId !== userId) {
          const error = new Error('Forbidden: You can only edit your own reviews');
          error.status = 403;
          throw error;
        }
        const updated = {
          ...review,
          ...(rating && { rating: parseInt(rating) }),
          ...(comment && { comment: comment.trim() })
        };
        inMemoryReviews.set(key, updated);
        return updated;
      }
    }
    const error = new Error('Review not found');
    error.status = 404;
    throw error;
  }
};

export const deleteReview = async (reviewId, userId, userRole) => {
  const rId = parseInt(reviewId);

  try {
    const existing = await prisma.review.findUnique({ where: { id: rId } });
    if (!existing) {
      const error = new Error('Review not found');
      error.status = 404;
      throw error;
    }

    if (userRole !== 'ADMIN' && existing.userId !== userId) {
      const error = new Error('Forbidden: You can only delete your own reviews');
      error.status = 403;
      throw error;
    }

    await prisma.review.delete({ where: { id: rId } });
    return { message: 'Review deleted successfully' };
  } catch (dbErr) {
    if (dbErr.status) throw dbErr;
    for (const [key, review] of inMemoryReviews.entries()) {
      if (review.id === rId) {
        if (userRole !== 'ADMIN' && review.userId !== userId) {
          const error = new Error('Forbidden: You can only delete your own reviews');
          error.status = 403;
          throw error;
        }
        inMemoryReviews.delete(key);
        return { message: 'Review deleted successfully' };
      }
    }
    const error = new Error('Review not found');
    error.status = 404;
    throw error;
  }
};
