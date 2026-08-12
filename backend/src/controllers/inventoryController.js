import * as inventoryService from '../services/inventoryService.js';

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await inventoryService.getInventoryByProductId(req.params.productId);
    return res.status(200).json({ inventory });
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    const inventory = await inventoryService.updateInventoryQuantity(req.params.productId, quantity);
    return res.status(200).json({
      message: 'Inventory updated successfully',
      inventory
    });
  } catch (error) {
    next(error);
  }
};
