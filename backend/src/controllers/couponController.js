import * as couponService from '../services/couponService.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const result = await couponService.validateCoupon({ code, subtotal });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return res.status(201).json({
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();
    return res.status(200).json({ coupons });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    return res.status(200).json({
      message: 'Coupon updated successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const result = await couponService.deleteCoupon(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
