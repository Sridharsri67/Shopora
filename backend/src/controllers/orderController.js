import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, couponCode } = req.body;
    const order = await orderService.createOrder({
      userId: req.user.userId,
      items,
      couponCode
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getCustomerOrders(req.user.userId);
    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.userId,
      req.user.role
    );
    return res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrdersAdmin();
    return res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatusAdmin(req.params.id, status);
    return res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};
