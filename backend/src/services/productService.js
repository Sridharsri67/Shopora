import prisma from '../config/database.js';
import redis from '../config/redis.js';

// In-memory fallback product store
const inMemoryProducts = new Map();
const inMemoryInventory = new Map();
let productIdCounter = 1;

// Helper to clear Redis product catalog cache on product mutations
const invalidateProductCache = async () => {
  try {
    const keys = await redis.keys('products:catalog:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis Cache] Invalidated ${keys.length} product catalog cache keys`);
    }
  } catch (err) {
    // Silent fallback if Redis is unavailable
  }
};

export const getAllProducts = async ({ search = '', category = '', page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);
  const cacheKey = `products:catalog:p${page}:l${limit}:c${category}:s${search}`;

  // 1. Check Redis Cache
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`[Redis Cache Hit] ${cacheKey}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    // Fall through to DB
  }

  // 2. Fetch from PostgreSQL / Database
  try {
    const where = {};
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: { inventory: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    const result = {
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take) || 1
      }
    };

    // Save into Redis with 300s TTL
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(result));
    } catch (err) {}

    return result;
  } catch (dbError) {
    // In-memory fallback
    let list = Array.from(inMemoryProducts.values());

    if (category) {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const total = list.length;
    const paginated = list.slice(skip, skip + take).map((p) => ({
      ...p,
      inventory: inMemoryInventory.get(p.id) || { quantity: 0 }
    }));

    return {
      products: paginated,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take) || 1
      }
    };
  }
};

export const getProductById = async (productId) => {
  const id = parseInt(productId);

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventory: true,
        reviews: {
          include: { user: { select: { id: true, name: true } } }
        }
      }
    });

    if (product) return product;
  } catch (dbError) {
    // Fall through
  }

  const product = inMemoryProducts.get(id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }

  const inventory = inMemoryInventory.get(id) || { quantity: 0 };
  return {
    ...product,
    inventory,
    reviews: []
  };
};

export const createProduct = async ({ name, description, price, imageUrl, category, quantity = 0 }) => {
  if (!name || price === undefined || price < 0) {
    const error = new Error('Product name and a valid non-negative price are required');
    error.status = 400;
    throw error;
  }

  const parsedPrice = parseFloat(price);
  const parsedQuantity = parseInt(quantity);

  if (parsedQuantity < 0) {
    const error = new Error('Inventory quantity cannot be negative');
    error.status = 400;
    throw error;
  }

  let product = null;
  try {
    product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parsedPrice,
        imageUrl: imageUrl || 'https://via.placeholder.com/300',
        category: category || 'General',
        inventory: {
          create: {
            quantity: parsedQuantity
          }
        }
      },
      include: { inventory: true }
    });
  } catch (dbError) {
    const newId = productIdCounter++;
    product = {
      id: newId,
      name,
      description: description || '',
      price: parsedPrice,
      imageUrl: imageUrl || 'https://via.placeholder.com/300',
      category: category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const inventory = {
      id: newId,
      productId: newId,
      quantity: parsedQuantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryProducts.set(newId, product);
    inMemoryInventory.set(newId, inventory);
    product = { ...product, inventory };
  }

  await invalidateProductCache();
  return product;
};

export const updateProduct = async (productId, productData) => {
  const id = parseInt(productId);
  const { name, description, price, imageUrl, category } = productData;

  if (price !== undefined && parseFloat(price) < 0) {
    const error = new Error('Price cannot be negative');
    error.status = 400;
    throw error;
  }

  let product = null;
  try {
    product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category })
      },
      include: { inventory: true }
    });
  } catch (dbError) {
    const existing = inMemoryProducts.get(id);
    if (!existing) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }

    product = {
      ...existing,
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(imageUrl && { imageUrl }),
      ...(category && { category }),
      updatedAt: new Date().toISOString()
    };

    inMemoryProducts.set(id, product);
    product = {
      ...product,
      inventory: inMemoryInventory.get(id) || { quantity: 0 }
    };
  }

  await invalidateProductCache();
  return product;
};

export const deleteProduct = async (productId) => {
  const id = parseInt(productId);

  try {
    await prisma.product.delete({ where: { id } });
  } catch (dbError) {
    if (!inMemoryProducts.has(id)) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    inMemoryProducts.delete(id);
    inMemoryInventory.delete(id);
  }

  await invalidateProductCache();
  return { message: 'Product deleted successfully' };
};
