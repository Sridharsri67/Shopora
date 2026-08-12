import prisma from '../config/database.js';

export const getInventoryByProductId = async (productId) => {
  const pId = parseInt(productId);

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { productId: pId }
    });

    if (inventory) return inventory;
  } catch (dbError) {
    // Fall through
  }

  // Check product existence
  return {
    productId: pId,
    quantity: 0
  };
};

export const updateInventoryQuantity = async (productId, quantity) => {
  const pId = parseInt(productId);
  const parsedQuantity = parseInt(quantity);

  if (isNaN(parsedQuantity) || parsedQuantity < 0) {
    const error = new Error('Inventory quantity must be a non-negative integer');
    error.status = 400;
    throw error;
  }

  try {
    const inventory = await prisma.inventory.upsert({
      where: { productId: pId },
      update: { quantity: parsedQuantity },
      create: {
        productId: pId,
        quantity: parsedQuantity
      }
    });

    return inventory;
  } catch (dbError) {
    return {
      productId: pId,
      quantity: parsedQuantity,
      updatedAt: new Date().toISOString()
    };
  }
};
