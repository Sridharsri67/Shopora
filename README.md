# Shopora — Full-Stack E-Commerce & Operations Portal 🛒

A modern, production-grade full-stack E-Commerce application built for high-performance product catalog management, authoritative backend pricing, Stripe payment webhooks, Redis caching, BullMQ background queues, product reviews, and 4-tier Role-Based Access Control (RBAC).

---

## Table of Contents

- [1. Architecture Overview & Diagrams](#1-architecture-overview--diagrams)
  - [A. High-Level System Architecture](#a-high-level-system-architecture)
  - [B. Database Entity Relationship Diagram (ERD)](#b-database-entity-relationship-diagram-erd)
  - [C. Order & Stripe Payment Sequence](#c-order--stripe-payment-sequence)
  - [D. RBAC Security Middleware Flow](#d-rbac-security-middleware-flow)
- [2. Role-Based Access Control (RBAC) Matrix](#2-role-based-access-control-rbac-matrix)
- [3. Key Architectural Patterns](#3-key-architectural-patterns)
- [4. Environment Variables Configuration](#4-environment-variables-configuration)
- [5. Local Development Setup Guide](#5-local-development-setup-guide)
- [6. Project Directory Structure](#6-project-directory-structure)
- [7. REST API Reference](#7-rest-api-reference)
- [8. Pre-Configured Test Credentials](#8-pre-configured-test-credentials)

---

## 1. Architecture Overview & Diagrams

The system follows a decoupled single-page application (SPA) and REST API backend architecture, emphasizing data safety, transactional consistency, real-time caching, off-thread job queues, and strict authorization guardrails.

### A. High-Level System Architecture

```mermaid
graph TD
    Client["React 19 SPA"] -->|HTTPS REST API| Gateway["Express.js API Router"]
    
    subgraph Security ["Security Layer"]
        Gateway --> AuthMiddleware["JWT Authentication Middleware"]
        AuthMiddleware --> RoleGuard["RBAC Authorization Middleware"]
    end
    
    subgraph Controllers ["Application Controllers"]
        RoleGuard --> AuthCtrl["Auth Controller"]
        RoleGuard --> ProdCtrl["Product Controller"]
        RoleGuard --> OrderCtrl["Order Controller"]
        RoleGuard --> InventoryCtrl["Inventory Controller"]
    end

    subgraph DataLayer ["Data & Caching Engine"]
        ProdCtrl -->|Cache| Redis[("Redis Cache")]
        ProdCtrl -->|Prisma Query| Prisma["Prisma ORM"]
        OrderCtrl -->|Transaction| Prisma
        InventoryCtrl -->|Stock Lock| Prisma
        Prisma --> DB[("PostgreSQL Database")]
    end

    subgraph External ["Asynchronous Integrations"]
        OrderCtrl -->|Checkout Session| Stripe["Stripe API"]
        Stripe -->|Raw Webhook| WebhookHandler["Stripe Webhook Handler"]
        WebhookHandler -->|Dispatch Job| Queue["BullMQ Redis Queue"]
        Queue -->|Off-thread Execution| EmailWorker["Email Worker Service"]
        EmailWorker -->|SMTP Email| Nodemailer["Nodemailer Service"]
    end
```

<details>
<summary>View Mermaid Source Code</summary>

```text
graph TD
    Client["React 19 SPA"] -->|HTTPS REST API| Gateway["Express.js API Router"]
    
    subgraph Security ["Security Layer"]
        Gateway --> AuthMiddleware["JWT Authentication Middleware"]
        AuthMiddleware --> RoleGuard["RBAC Authorization Middleware"]
    end
    
    subgraph Controllers ["Application Controllers"]
        RoleGuard --> AuthCtrl["Auth Controller"]
        RoleGuard --> ProdCtrl["Product Controller"]
        RoleGuard --> OrderCtrl["Order Controller"]
        RoleGuard --> InventoryCtrl["Inventory Controller"]
    end

    subgraph DataLayer ["Data & Caching Engine"]
        ProdCtrl -->|Cache| Redis[("Redis Cache")]
        ProdCtrl -->|Prisma Query| Prisma["Prisma ORM"]
        OrderCtrl -->|Transaction| Prisma
        InventoryCtrl -->|Stock Lock| Prisma
        Prisma --> DB[("PostgreSQL Database")]
    end

    subgraph External ["Asynchronous Integrations"]
        OrderCtrl -->|Checkout Session| Stripe["Stripe API"]
        Stripe -->|Raw Webhook| WebhookHandler["Stripe Webhook Handler"]
        WebhookHandler -->|Dispatch Job| Queue["BullMQ Redis Queue"]
        Queue -->|Off-thread Execution| EmailWorker["Email Worker Service"]
        EmailWorker -->|SMTP Email| Nodemailer["Nodemailer Service"]
    end
```

</details>

---

### B. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    PRODUCT ||--o| INVENTORY : "has"
    PRODUCT ||--o{ ORDER_ITEM : "included_in"
    PRODUCT ||--o{ REVIEW : "receives"
    ORDER ||--|{ ORDER_ITEM : "contains"

    USER {
        int id PK
        string name
        string email UK
        string passwordHash
        string role
        datetime createdAt
        datetime updatedAt
    }

    PRODUCT {
        int id PK
        string name
        string description
        float price
        string imageUrl
        string category
        datetime createdAt
        datetime updatedAt
    }

    INVENTORY {
        int id PK
        int productId FK
        int quantity
        datetime createdAt
        datetime updatedAt
    }

    ORDER {
        int id PK
        int userId FK
        float totalAmount
        float subtotal
        float discount
        string status
        string paymentStatus
        string stripeSessionId
        datetime createdAt
        datetime updatedAt
    }

    ORDER_ITEM {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        float price
    }

    COUPON {
        int id PK
        string code UK
        string discountType
        float discountValue
        float minimumOrder
        int usageLimit
        int usedCount
        datetime expiresAt
        boolean active
        datetime createdAt
    }

    REVIEW {
        int id PK
        int userId FK
        int productId FK
        int rating
        string comment
        datetime createdAt
        datetime updatedAt
    }
```

<details>
<summary>View Mermaid Source Code</summary>

```text
erDiagram
    USER ||--o{ ORDER : "places"
    USER ||--o{ REVIEW : "writes"
    PRODUCT ||--o| INVENTORY : "has"
    PRODUCT ||--o{ ORDER_ITEM : "included_in"
    PRODUCT ||--o{ REVIEW : "receives"
    ORDER ||--|{ ORDER_ITEM : "contains"

    USER {
        int id PK
        string name
        string email UK
        string passwordHash
        string role
        datetime createdAt
        datetime updatedAt
    }

    PRODUCT {
        int id PK
        string name
        string description
        float price
        string imageUrl
        string category
        datetime createdAt
        datetime updatedAt
    }

    INVENTORY {
        int id PK
        int productId FK
        int quantity
        datetime createdAt
        datetime updatedAt
    }

    ORDER {
        int id PK
        int userId FK
        float totalAmount
        float subtotal
        float discount
        string status
        string paymentStatus
        string stripeSessionId
        datetime createdAt
        datetime updatedAt
    }

    ORDER_ITEM {
        int id PK
        int orderId FK
        int productId FK
        int quantity
        float price
    }

    COUPON {
        int id PK
        string code UK
        string discountType
        float discountValue
        float minimumOrder
        int usageLimit
        int usedCount
        datetime expiresAt
        boolean active
        datetime createdAt
    }

    REVIEW {
        int id PK
        int userId FK
        int productId FK
        int rating
        string comment
        datetime createdAt
        datetime updatedAt
    }
```

</details>

---

### C. Order & Stripe Payment Sequence

When a customer initiates an order, the system computes prices server-side, validates inventory, initiates a Stripe checkout session, and processes payment asynchronously via webhooks:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant React as React Client
    participant Router as Express Router
    participant RBAC as RBAC Guard
    participant Transaction as Prisma Transaction
    participant DB as PostgreSQL DB

    Customer->>React: Click Checkout
    React->>Router: POST /api/orders
    Router->>RBAC: Check Role Authorization
    alt Authorized User
        RBAC->>Transaction: Execute Atomic Transaction
        Transaction->>DB: Check Product Stock & Calculate Subtotal
        Transaction->>DB: Create Order & Reserve Inventory
        Transaction-->>Router: Commit Transaction
        Router-->>React: HTTP 201 Created (Order)
        React-->>Customer: Display Order Confirmation
    else Unauthorized
        RBAC-->>React: HTTP 403 Forbidden
    end
```

<details>
<summary>View Mermaid Source Code</summary>

```text
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant React as React Client
    participant Router as Express Router
    participant RBAC as RBAC Guard
    participant Transaction as Prisma Transaction
    participant DB as PostgreSQL DB

    Customer->>React: Click Checkout
    React->>Router: POST /api/orders
    Router->>RBAC: Check Role Authorization
    alt Authorized User
        RBAC->>Transaction: Execute Atomic Transaction
        Transaction->>DB: Check Product Stock & Calculate Subtotal
        Transaction->>DB: Create Order & Reserve Inventory
        Transaction-->>Router: Commit Transaction
        Router-->>React: HTTP 201 Created (Order)
        React-->>Customer: Display Order Confirmation
    else Unauthorized
        RBAC-->>React: HTTP 403 Forbidden
    end
```

</details>

---

### D. RBAC Security Middleware Flow

```mermaid
flowchart LR
    Req["HTTP Request"] --> Auth{"JWT Token Present?"}
    Auth -- No --> Deny401["HTTP 401 Unauthorized"]
    Auth -- Yes --> Verify["Verify Signature"]
    Verify -- Invalid --> Deny401
    Verify -- Valid --> Attach["Attach req.user"]
    Attach --> RoleCheck{"User Role Allowed?"}
    RoleCheck -- No --> Deny403["HTTP 403 Forbidden"]
    RoleCheck -- Yes --> Pass["Execute Controller"]
```

<details>
<summary>View Mermaid Source Code</summary>

```text
flowchart LR
    Req["HTTP Request"] --> Auth{"JWT Token Present?"}
    Auth -- No --> Deny401["HTTP 401 Unauthorized"]
    Auth -- Yes --> Verify["Verify Signature"]
    Verify -- Invalid --> Deny401
    Verify -- Valid --> Attach["Attach req.user"]
    Attach --> RoleCheck{"User Role Allowed?"}
    RoleCheck -- No --> Deny403["HTTP 403 Forbidden"]
    RoleCheck -- Yes --> Pass["Execute Controller"]
```

</details>

---

## 2. Role-Based Access Control (RBAC) Matrix

Route middleware (`authorizeRoles`) strictly enforces permissions based on operational enterprise roles:

| Module / Operational Action | CUSTOMER | VENDOR | DELIVERY | ADMIN |
| :--- | :---: | :---: | :---: | :---: |
| **Browse Product Catalog & Reviews** | Yes | Yes | Yes | Yes |
| **User Authentication (`/api/auth/me`)** | Yes | Yes | Yes | Yes |
| **Add to Cart & Checkout Order** | Yes | No | No | Yes |
| **View Own Personal Orders** | Yes | No | No | Yes |
| **Submit Product Review (1–5 Stars)** | Yes | No | No | Yes |
| **Create & Update Products** | No | Yes | No | Yes |
| **Delete Product Catalog Entry** | No | Yes | No | Yes |
| **Adjust Stock Quantities** | No | Yes | No | Yes |
| **View Global Logistics Orders List** | No | No | Yes | Yes |
| **Update Order Status (`PROCESSING`, `SHIPPED`, `DELIVERED`)** | No | No | Yes | Yes |
| **Create & Manage Coupons** | No | No | No | Yes |

---

## 3. Key Architectural Patterns

1. **Authoritative Backend Pricing & Discount Engine**:
   - Order subtotals and discounts are calculated strictly on the backend using PostgreSQL database prices.
   - Prevents client-side price tampering or stale discount manipulation during checkout.

2. **Event-Driven Payment Webhooks & Async Worker Queues**:
   - Payments are confirmed asynchronously using raw Stripe signature verification (`POST /api/payments/webhook`).
   - Confirmation emails are queued into **Redis / BullMQ** (`emailQueue`) and processed off-thread by `emailWorker` to keep HTTP response latency minimal.

3. **High-Performance Redis Catalog Caching**:
   - Product catalog queries (`GET /api/products`) are cached in Redis under the `products:catalog:*` key namespace.
   - Automatic cache invalidation triggers whenever a product is created, updated, or deleted by an `ADMIN` or `VENDOR`.

4. **Resilient Fallback Architecture**:
   - Graceful in-memory fallback repositories ensure zero application crashes even if local database or Redis services are temporarily offline during development or maintenance.

---

## 4. Environment Variables Configuration

> [!IMPORTANT]
> Never commit actual credentials or private keys to source control. Use environment configuration files (`.env`) to manage environment secrets.

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | Port for Express API server | `5001` |
| `NODE_ENV` | Yes | Node environment (`development` / `production`) | `development` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/shopora_db?schema=public` |
| `REDIS_URL` | Optional | Redis connection string (Fallback active if offline) | `redis://localhost:6379` |
| `JWT_SECRET` | Yes | Secret key for signing Auth JWT tokens | `supersecret_jwt_key_shopora_dev_2026` |
| `FRONTEND_URL` | Yes | Client origin URL for CORS policy | `http://localhost:5173` |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key | `sk_test_51...` |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook endpoint secret | `whsec_...` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | Base endpoint URL for Express REST API | `http://localhost:5001/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable API key | `pk_test_51...` |

---

## 5. Local Development Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance (v14+) running on `localhost:5432`
- **Redis**: Optional (v6+, graceful fallback active if offline)

---

### Step 1: Clone Repository & Setup Environment Files

```bash
# Clone the repository
git clone https://github.com/Sridharsri67/Shopora.git
cd Shopora

# Create backend environment file
cat <<EOT > backend/.env
PORT=5001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopora_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret_jwt_key_shopora_dev_2026
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_mock
STRIPE_WEBHOOK_SECRET=whsec_mock
EOT

# Create frontend environment file
cat <<EOT > frontend/.env
VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sample
EOT
```

---

### Step 2: Backend Setup & Database Migration

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client & Push Database Schema
npx prisma generate
npx prisma db push

# Seed initial system accounts, catalog products, and test coupon
npm run seed
```

> [!NOTE]
> Seeding populates operational accounts (`admin@example.com`, `vendor@example.com`, `delivery@example.com`, `customer@example.com`), initial catalog inventory, and the active `SAVE10` coupon code.

---

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install
```

---

### Step 4: Run Development Servers

**In Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```
*(API Server running on `http://localhost:5001`)*

**In Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
```
*(React Single Page App running on `http://localhost:5173`)*

---

## 6. Project Directory Structure

```text
Shopora/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL models, enums & relations
│   │   └── seed.js                # Database seeder script
│   ├── src/
│   │   ├── config/                # Database, Redis & Stripe clients
│   │   ├── controllers/           # HTTP request handlers (Auth, Product, Order, etc.)
│   │   ├── middleware/            # Auth JWT, RBAC guards & error handlers
│   │   ├── queues/                # BullMQ email queue definition
│   │   ├── routes/                # Express API route endpoints
│   │   ├── services/              # Business logic & Prisma transactional operations
│   │   ├── utils/                 # Password hashing & JWT helpers
│   │   ├── workers/               # Off-thread email queue processor
│   │   ├── app.js                 # Express application setup & middleware stack
│   │   └── server.js              # Application entry point & HTTP listener
│   ├── .env                       # Backend environment variables
│   └── package.json
├── frontend/
│   ├── public/                    # Static favicon & icons
│   ├── src/
│   │   ├── components/            # Reusable UI components (Navbar, Footer, ProductGrid, Badge)
│   │   ├── context/               # AuthContext & CartContext state providers
│   │   ├── pages/                 # Home, Products, Cart, Checkout, Orders, Profile
│   │   │   └── admin/             # Dashboard, AdminProducts, AdminInventory, AdminOrders, AdminCoupons
│   │   ├── services/              # Axios HTTP client API endpoints
│   │   ├── App.jsx                # Main route configuration
│   │   ├── index.css              # Tailwind CSS configuration & tokens
│   │   └── main.jsx               # React DOM entry point
│   ├── .env                       # Frontend environment variables
│   ├── vite.config.js             # Vite bundler configuration
│   └── package.json
└── README.md                      # Architecture & Documentation handbook
```

---

## 7. REST API Reference

### Auth Endpoints
- `POST /api/auth/register` — Register new user (Supports `CUSTOMER`, `VENDOR`, `DELIVERY` roles)
- `POST /api/auth/login` — Login user & receive JWT token
- `GET /api/auth/me` — Retrieve current user profile *(Auth required)*
- `GET /api/auth/vendor-only` — Verify vendor RBAC guard *(Vendor/Admin required)*
- `GET /api/auth/delivery-only` — Verify delivery partner RBAC guard *(Delivery/Admin required)*

### Product Catalog & Inventory Endpoints
- `GET /api/products` — Browse paginated products *(Redis cached)*
- `GET /api/products/:id` — Retrieve product details by ID
- `POST /api/products` — Create new product *(Admin & Vendor required)*
- `PUT /api/products/:id` — Modify existing product *(Admin & Vendor required)*
- `DELETE /api/products/:id` — Delete product entry *(Admin & Vendor required)*
- `GET /api/inventory/:productId` — Get real-time product stock level
- `PUT /api/inventory/:productId` — Update product stock quantity *(Admin & Vendor required)*

### Coupon Endpoints
- `POST /api/coupons/validate` — Validate coupon code & check eligibility
- `GET /api/coupons` — List all system coupons *(Admin required)*
- `POST /api/coupons` — Create new discount coupon *(Admin required)*

### Order & Payment Endpoints
- `POST /api/orders` — Create new order with authoritative backend subtotal
- `GET /api/orders` — List personal customer order history *(Auth required)*
- `GET /api/orders/admin/all` — List all global logistics orders *(Admin & Delivery required)*
- `PUT /api/orders/admin/:id/status` — Update order status (`PROCESSING`, `SHIPPED`, `DELIVERED`) *(Admin & Delivery required)*
- `POST /api/payments/create-checkout` — Initialize Stripe Checkout Session
- `POST /api/payments/webhook` — Process raw Stripe webhook signatures

### Product Review Endpoints
- `GET /api/products/:productId/reviews` — Fetch customer reviews for a product
- `POST /api/products/:productId/reviews` — Submit 1–5 star rating & review *(Auth required)*

---

## 8. Pre-Configured Test Credentials

### 👤 Customer Account
- **Email**: `customer@example.com`
- **Password**: `password123`
- **Role**: `CUSTOMER`
- **Capabilities**: Browse products, Add to Cart, Apply Coupons, Checkout, View Orders, Submit Reviews.

### 🛡️ Admin Account
- **Email**: `admin@example.com`
- **Password**: `password123`
- **Role**: `ADMIN`
- **Capabilities**: Full Admin Portal (`/admin`), Catalog CRUD, Stock Editor, Global Orders Manager, Coupon Creator.

### 🏭 Vendor Account
- **Email**: `vendor@example.com`
- **Password**: `password123`
- **Role**: `VENDOR`
- **Capabilities**: Catalog management (Add/Edit/Delete Products, Adjust Inventory levels).

### 🚚 Delivery Partner Account
- **Email**: `delivery@example.com`
- **Password**: `password123`
- **Role**: `DELIVERY`
- **Capabilities**: Logistics portal, View global order list, Update delivery statuses (`PROCESSING` -> `SHIPPED` -> `DELIVERED`).

### 🏷️ Active Coupon Code
- **Code**: `SAVE10` *(10% Discount on orders over ₹500)*

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
