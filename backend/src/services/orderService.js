import prisma from '../config/database.js';
import { validateCoupon } from './couponService.js';

// In-memory fallback order store
const inMemoryOrders = new Map();
let orderIdCounter = 1;

export const createOrder = async ({ userId, items, couponCode }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Order items must be a non-empty array');
    error.status = 400;
    throw error;
  }

  // 1. Retrieve authoritative products and validate stock
  const productIds = items.map((i) => parseInt(i.productId));

  let dbProducts = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { inventory: true }
    });
  } catch (dbError) {
    // DB offline fallback handling
  }

  const orderItemsData = [];
  let calculatedSubtotal = 0;

  for (const item of items) {
    const pId = parseInt(item.productId);
    const requestedQty = parseInt(item.quantity);

    if (isNaN(requestedQty) || requestedQty <= 0) {
      const error = new Error(`Invalid item quantity for product ID ${pId}`);
      error.status = 400;
      throw error;
    }

    const product = dbProducts.find((p) => p.id === pId);

    if (!product) {
      const error = new Error(`Product with ID ${pId} not found`);
      error.status = 404;
      throw error;
    }

    const availableStock = product.inventory ? product.inventory.quantity : 0;
    if (availableStock < requestedQty) {
      const error = new Error(`Insufficient inventory for product "${product.name}". Requested: ${requestedQty}, Available: ${availableStock}`);
      error.status = 400;
      throw error;
    }

    const itemPrice = parseFloat(product.price);
    calculatedSubtotal += itemPrice * requestedQty;

    orderItemsData.push({
      productId: pId,
      quantity: requestedQty,
      price: itemPrice
    });
  }

  // 2. Coupon Validation & Discount calculation
  let discount = 0;
  if (couponCode) {
    const couponValidation = await validateCoupon({ code: couponCode, subtotal: calculatedSubtotal });
    discount = couponValidation.discount;
  }

  const finalTotalAmount = parseFloat(Math.max(0, calculatedSubtotal - discount).toFixed(2));

  // 3. Save Order to Database
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId,
        subtotal: calculatedSubtotal,
        discount,
        totalAmount: finalTotalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (couponCode) {
      try {
        await prisma.coupon.update({
          where: { code: couponCode.trim().toUpperCase() },
          data: { usedCount: { increment: 1 } }
        });
      } catch (err) {
        // Ignore coupon increment error
      }
    }

    return newOrder;
  } catch (dbError) {
    // In-memory fallback order creation
    const newId = orderIdCounter++;
    const order = {
      id: newId,
      userId,
      subtotal: calculatedSubtotal,
      discount,
      totalAmount: finalTotalAmount,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItemsData.map((item, idx) => ({
        id: idx + 1,
        orderId: newId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    inMemoryOrders.set(newId, order);
    return order;
  }
};

export const getCustomerOrders = async (userId) => {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (dbError) {
    return Array.from(inMemoryOrders.values()).filter((o) => o.userId === userId);
  }
};

export const getOrderById = async (orderId, userId, userRole) => {
  const oId = parseInt(orderId);

  try {
    const order = await prisma.order.findUnique({
      where: { id: oId },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }

    if (userRole !== 'ADMIN' && order.userId !== userId) {
      const error = new Error('Forbidden: You can only view your own orders');
      error.status = 403;
      throw error;
    }

    return order;
  } catch (dbError) {
    if (dbError.status) throw dbError;
    const order = inMemoryOrders.get(oId);
    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }
    if (userRole !== 'ADMIN' && order.userId !== userId) {
      const error = new Error('Forbidden: You can only view your own orders');
      error.status = 403;
      throw error;
    }
    return order;
  }
};

export const getAllOrdersAdmin = async () => {
  try {
    return await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (dbError) {
    return Array.from(inMemoryOrders.values());
  }
};

export const updateOrderStatusAdmin = async (orderId, status) => {
  const oId = parseInt(orderId);
  const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (!status || !validStatuses.includes(status.toUpperCase())) {
    const error = new Error(`Invalid order status. Allowed: [${validStatuses.join(', ')}]`);
    error.status = 400;
    throw error;
  }

  const upperStatus = status.toUpperCase();

  try {
    return await prisma.order.update({
      where: { id: oId },
      data: { status: upperStatus },
      include: { items: true }
    });
  } catch (dbError) {
    const order = inMemoryOrders.get(oId);
    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }
    order.status = upperStatus;
    order.updatedAt = new Date().toISOString();
    inMemoryOrders.set(oId, order);
    return order;
  }
};
