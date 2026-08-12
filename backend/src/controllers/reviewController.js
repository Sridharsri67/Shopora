import * as reviewService from '../services/reviewService.js';

export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const review = await reviewService.createReview({
      userId: req.user.userId,
      productId,
      rating,
      comment
    });
    return res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getProductReviews(productId);
    return res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.updateReview(id, req.user.userId, req.body);
    return res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.deleteReview(id, req.user.userId, req.user.role);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
