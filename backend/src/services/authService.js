import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

// In-memory fallback repository for offline DB environments
const inMemoryUsers = new Map();
let mockIdCounter = 1;

export const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.status = 409;
      throw error;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: role || 'CUSTOMER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  } catch (dbError) {
    if (dbError.status === 409) throw dbError;

    // Fallback to in-memory store if DB is offline
    if (inMemoryUsers.has(normalizedEmail)) {
      const error = new Error('User with this email already exists');
      error.status = 409;
      throw error;
    }

    const passwordHash = await hashPassword(password);
    const user = {
      id: mockIdCounter++,
      name,
      email: normalizedEmail,
      passwordHash,
      role: role || 'CUSTOMER',
      createdAt: new Date().toISOString()
    };

    inMemoryUsers.set(normalizedEmail, user);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { user: userResponse, token };
  }
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (user) {
      const isPasswordValid = await comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { user: userWithoutPassword, token };
    }
  } catch (dbError) {
    if (dbError.status === 401) throw dbError;
    // Fall through to in-memory check
  }

  // Fallback to in-memory store
  const user = inMemoryUsers.get(normalizedEmail);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return { user: userResponse, token };
};

export const getUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (user) return user;
  } catch (dbError) {
    // Fall through
  }

  // Check in-memory store
  for (const user of inMemoryUsers.values()) {
    if (user.id === userId) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };
    }
  }

  const error = new Error('User not found');
  error.status = 404;
  throw error;
};
