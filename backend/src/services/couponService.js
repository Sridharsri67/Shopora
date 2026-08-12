import prisma from '../config/database.js';

// In-memory fallback coupon repository
const inMemoryCoupons = new Map();
let couponIdCounter = 1;

// Seed initial demo coupon "SAVE10" in-memory fallback
inMemoryCoupons.set('SAVE10', {
  id: couponIdCounter++,
  code: 'SAVE10',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  minimumOrder: 0,
  usageLimit: null,
  usedCount: 0,
  expiresAt: null,
  active: true,
  createdAt: new Date().toISOString()
});

export const validateCoupon = async ({ code, subtotal }) => {
  if (!code) {
    const error = new Error('Coupon code is required');
    error.status = 400;
    throw error;
  }

  const parsedSubtotal = parseFloat(subtotal) || 0;
  const upperCode = code.trim().toUpperCase();

  let coupon = null;

  try {
    coupon = await prisma.coupon.findUnique({
      where: { code: upperCode }
    });
  } catch (dbError) {
    coupon = inMemoryCoupons.get(upperCode);
  }

  if (!coupon) {
    const error = new Error('Invalid or non-existent coupon code');
    error.status = 404;
    throw error;
  }

  if (!coupon.active) {
    const error = new Error('This coupon is no longer active');
    error.status = 400;
    throw error;
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    const error = new Error('This coupon has expired');
    error.status = 400;
    throw error;
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    const error = new Error('This coupon usage limit has been reached');
    error.status = 400;
    throw error;
  }

  if (parsedSubtotal < coupon.minimumOrder) {
    const error = new Error(`Minimum order total of ₹${coupon.minimumOrder} required for coupon ${upperCode}`);
    error.status = 400;
    throw error;
  }

  let discount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discount = (parsedSubtotal * coupon.discountValue) / 100;
  } else if (coupon.discountType === 'FIXED') {
    discount = Math.min(coupon.discountValue, parsedSubtotal);
  }

  const finalAmount = Math.max(0, parsedSubtotal - discount);

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount: parseFloat(discount.toFixed(2)),
    subtotal: parsedSubtotal,
    finalAmount: parseFloat(finalAmount.toFixed(2))
  };
};

export const createCoupon = async ({ code, discountType, discountValue, minimumOrder = 0, usageLimit = null, expiresAt = null }) => {
  if (!code || !discountType || discountValue === undefined) {
    const error = new Error('Code, discountType (PERCENTAGE or FIXED), and discountValue are required');
    error.status = 400;
    throw error;
  }

  const upperCode = code.trim().toUpperCase();

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: upperCode,
        discountType,
        discountValue: parseFloat(discountValue),
        minimumOrder: parseFloat(minimumOrder),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: true
      }
    });
    return coupon;
  } catch (dbError) {
    if (inMemoryCoupons.has(upperCode)) {
      const error = new Error('Coupon code already exists');
      error.status = 409;
      throw error;
    }

    const coupon = {
      id: couponIdCounter++,
      code: upperCode,
      discountType,
      discountValue: parseFloat(discountValue),
      minimumOrder: parseFloat(minimumOrder),
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      usedCount: 0,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      active: true,
      createdAt: new Date().toISOString()
    };

    inMemoryCoupons.set(upperCode, coupon);
    return coupon;
  }
};

export const getAllCoupons = async () => {
  try {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (dbError) {
    return Array.from(inMemoryCoupons.values());
  }
};

export const updateCoupon = async (id, data) => {
  const cId = parseInt(id);

  try {
    return await prisma.coupon.update({
      where: { id: cId },
      data
    });
  } catch (dbError) {
    for (const [code, coupon] of inMemoryCoupons.entries()) {
      if (coupon.id === cId) {
        const updated = { ...coupon, ...data };
        inMemoryCoupons.set(code, updated);
        return updated;
      }
    }
    const error = new Error('Coupon not found');
    error.status = 404;
    throw error;
  }
};

export const deleteCoupon = async (id) => {
  const cId = parseInt(id);

  try {
    await prisma.coupon.delete({ where: { id: cId } });
    return { message: 'Coupon deleted successfully' };
  } catch (dbError) {
    for (const [code, coupon] of inMemoryCoupons.entries()) {
      if (coupon.id === cId) {
        inMemoryCoupons.delete(code);
        return { message: 'Coupon deleted successfully' };
      }
    }
    const error = new Error('Coupon not found');
    error.status = 404;
    throw error;
  }
};
