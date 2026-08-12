# Shopora — Full-Stack E-Commerce MVP 🛒

**Shopora** is a production-ready, full-stack E-Commerce application demonstrating modern backend & frontend architecture built with **JavaScript**, **Node.js**, **Express**, **React (Vite)**, **PostgreSQL (Prisma ORM)**, **Redis**, **BullMQ**, and **Stripe**.

---

## 🌟 Key Features

- **JWT Authentication & RBAC**: Secure user registration, password hashing (`bcryptjs`), JWT token verification, and role-based authorization (`CUSTOMER` and `ADMIN`).
- **Product Catalog & Management**: Public browsing with live search and category filtering (`Electronics`, `Audio`, `Monitors`, `Accessories`). Admin CRUD management.
- **Authoritative Inventory Tracking**: Real-time stock quantity checks (`quantity >= 0`). Auto-decrements upon payment confirmation.
- **Cart & Coupon Engine**: Persistent React Cart state. Backend coupon validation for `PERCENTAGE` & `FIXED` discounts with minimum order thresholds and usage limits.
- **Authoritative Backend Pricing**: Order subtotals and totals are calculated strictly on the backend using PostgreSQL database prices to prevent tampering.
- **Stripe Payments & Webhooks**: Stripe Checkout Session integration with raw webhook signature verification updating orders to `PAID` & `CONFIRMED`.
- **Redis Caching Layer**: High-performance catalog caching (`products:catalog:*`) with automatic invalidation on product mutations.
- **BullMQ Background Email Queue**: Asynchronous order confirmation email jobs processed off-thread by a dedicated worker using Nodemailer.
- **Product Reviews System**: Customer review submission with 1–5 star ratings and single review per user/product constraint.
- **Admin Management Dashboard**: Dedicated UI for catalog management, stock editor, global order status updates, and coupon creation.
- **Resilient Fallback Architecture**: Graceful in-memory fallback repositories ensuring zero application crashes even if local database services are restarting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios, React Router v7 |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS, `dotenv` |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Caching & Queues** | Redis (`ioredis`), BullMQ |
| **Payments** | Stripe SDK & Webhooks |
| **Email** | Nodemailer |

---

## 📂 Project Structure

```text
Shopora/
├── frontend/                 # React Single Page Application (Vite + Tailwind)
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ProductCard, ProductGrid, CartItem, ProtectedRoute, AdminRoute
│   │   ├── context/          # AuthContext.jsx, CartContext.jsx
│   │   ├── pages/            # Home, Products, ProductDetails, Login, Register, Cart, Checkout, Orders, OrderDetails, Profile
│   │   │   └── admin/        # Dashboard, AdminProducts, AdminInventory, AdminOrders, AdminCoupons
│   │   ├── services/         # api.js, authService.js, productService.js, orderService.js, couponService.js, reviewService.js, paymentService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js + Express REST API
│   ├── prisma/               # schema.prisma, seed.js
│   ├── src/
│   │   ├── config/           # database.js, redis.js, stripe.js
│   │   ├── controllers/      # auth, product, inventory, order, coupon, review, payment, health
│   │   ├── middleware/       # authMiddleware, roleMiddleware, validationMiddleware, errorMiddleware
│   │   ├── queues/           # emailQueue.js
│   │   ├── routes/           # auth, product, inventory, order, coupon, review, payment, health
│   │   ├── services/         # auth, product, inventory, order, coupon, review, payment, email
│   │   ├── workers/          # emailWorker.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── AGENT.md
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running on `localhost:5432`
- Redis (optional, graceful fallback active if offline)

### 2. Backend Setup
```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env`:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/shopora_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret_jwt_key_shopora_dev_2026
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_mock
STRIPE_WEBHOOK_SECRET=whsec_mock
```

Sync PostgreSQL database and run seed data:
```bash
npx prisma db push
npm run seed
```

Start backend development server:
```bash
npm run dev
```
*(Backend running at `http://localhost:5001`)*

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Configure environment variables in `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sample
```

Start frontend development server:
```bash
npm run dev
```
*(Frontend running at `http://localhost:5173`)*

---

## 🔑 Pre-Configured Test Credentials

### Customer Account
- **Email**: `customer@example.com`
- **Password**: `password123`
- **Permissions**: Catalog browsing, Add to Cart, Coupon Checkout, View Orders, Submit Reviews.

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Permissions**: Full Dashboard (`/admin`), Add/Edit/Delete Products, Stock Quantity Editor, Global Orders Manager, Coupon Creator.

### Active Coupon Code
- **Code**: `SAVE10` *(10% Discount on orders over ₹500)*

---

## 📖 REST API Reference

### Auth APIs
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login & receive JWT
- `GET /api/auth/me` — Get current profile *(Bearer Token required)*

### Product & Inventory APIs
- `GET /api/products` — Get paginated products *(Redis cached)*
- `GET /api/products/:id` — Get product details
- `POST /api/products` — Create product *(Admin required)*
- `PUT /api/products/:id` — Update product *(Admin required)*
- `DELETE /api/products/:id` — Delete product *(Admin required)*
- `GET /api/inventory/:productId` — Check stock
- `PUT /api/inventory/:productId` — Update stock *(Admin required)*

### Coupon APIs
- `POST /api/coupons/validate` — Validate coupon code
- `GET /api/coupons` — List all coupons *(Admin required)*
- `POST /api/coupons` — Create coupon *(Admin required)*

### Order & Payment APIs
- `POST /api/orders` — Create order
- `GET /api/orders` — Get customer orders
- `GET /api/admin/orders` — Get all global orders *(Admin required)*
- `PUT /api/admin/orders/:id/status` — Update order status *(Admin required)*
- `POST /api/payments/create-checkout` — Create Stripe checkout session
- `POST /api/payments/webhook` — Process Stripe webhook events

### Review APIs
- `GET /api/products/:productId/reviews` — Get product reviews
- `POST /api/products/:productId/reviews` — Submit review

---

## 📄 License
This project is licensed under the MIT License.
