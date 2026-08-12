import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Password Hash
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 2. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      role: 'ADMIN'
    }
  });

  // 3. Customer User
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Customer',
      email: 'customer@example.com',
      passwordHash,
      role: 'CUSTOMER'
    }
  });

  console.log('✅ Users seeded:', { admin: admin.email, customer: customer.email });

  // 4. Products & Inventory
  const productsData = [
    {
      name: 'RGB Mechanical Keyboard',
      description: 'Hot-swappable mechanical keyboard with RGB backlighting and tactile switches.',
      price: 2999,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
      category: 'Electronics',
      quantity: 25
    },
    {
      name: 'Wireless Ergonomic Mouse',
      description: 'Ultra-fast 2.4GHz and Bluetooth dual-mode wireless mouse with silent clicks.',
      price: 1499,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
      category: 'Electronics',
      quantity: 50
    },
    {
      name: 'Noise Cancelling Headphones',
      description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
      price: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      category: 'Audio',
      quantity: 15
    },
    {
      name: '27-inch 4K UHD Monitor',
      description: 'IPS display with HDR10 support, 99% sRGB color gamut, and USB-C power delivery.',
      price: 18999,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
      category: 'Monitors',
      quantity: 10
    },
    {
      name: '7-in-1 USB-C Hub',
      description: 'Aluminum USB-C adapter with 4K HDMI, 100W PD charging, SD card reader, and 3 USB 3.0 ports.',
      price: 1299,
      imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&q=80',
      category: 'Accessories',
      quantity: 30
    },
    {
      name: 'Aluminum Ergonomic Laptop Stand',
      description: 'Adjustable aluminum laptop riser compatible with all MacBooks and laptops 10-17 inches.',
      price: 899,
      imageUrl: 'https://images.unsplash.com/photo-1616440342981-b25dd6774646?w=500&q=80',
      category: 'Accessories',
      quantity: 40
    }
  ];

  for (const item of productsData) {
    const { quantity, ...productFields } = item;
    const existing = await prisma.product.findFirst({
      where: { name: productFields.name }
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          ...productFields,
          inventory: {
            create: { quantity }
          }
        }
      });
    }
  }

  console.log('✅ Products & Inventory seeded');

  // 5. Coupon
  await prisma.coupon.upsert({
    where: { code: 'SAVE10' },
    update: {},
    create: {
      code: 'SAVE10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minimumOrder: 500,
      active: true
    }
  });

  console.log('✅ Seed Coupon created: SAVE10 (10% OFF)');
  console.log('🚀 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
