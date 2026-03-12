# 🛒 Local Shop

A full-stack multi-vendor e-commerce platform built with the MERN stack. Local Shop supports three distinct user roles — **Buyers**, **Sellers**, and **Admins** — each with their own dedicated dashboards, authentication flows, and feature sets.

---

## 🏗️ Architecture Overview

```
local-shop/
├── client/         # React + Vite frontend (SPA)
└── server/         # Node.js + Express REST API backend
```

The application follows a **monorepo structure** with a clean separation between client and server. The frontend is a single-page application (SPA) deployed on Vercel, while the backend serves a RESTful API connected to MongoDB Atlas.

### System Design

```
Browser (React SPA)
       │
       ▼
  Vite Dev Server / Vercel CDN
       │
       ▼
  Express REST API (Node.js)
       │
  ┌────┴──────────────────────┐
  │                           │
MongoDB Atlas           Cloudinary CDN
(Data persistence)      (Image storage)
       │
  ┌────┴────┐
Razorpay    Nodemailer
(Payments)  (OTP Emails)
```

---

## 🧰 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| React Router DOM | Client-side routing |
| Redux Toolkit | Global state management |
| Axios | HTTP client for API calls |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Pre-built accessible UI components |
| Recharts | Charts and data visualizations |
| React Cropper | In-browser image cropping |
| React Hook Form | Form state management |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | NoSQL database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| Multer | File upload handling |
| Cloudinary | Cloud image storage |
| Nodemailer | OTP email delivery |
| Razorpay | Payment gateway integration |
| Passport.js + Google OAuth | Social login |
| Helmet | HTTP security headers |
| express-rate-limit | Brute-force protection |
| express-validator | Server-side input validation |
| Morgan | HTTP request logging |
| node-cron | Scheduled background jobs |
| cors | Cross-origin resource sharing |
| cookie-parser | Cookie management |

---

## ✨ Features

### 👤 Buyer Features

- **Authentication**
  - Email/password registration with OTP email verification
  - Google OAuth single sign-on
  - Forgot password with OTP reset flow
  - JWT-based session management via HTTP-only cookies

- **Shopping**
  - Product listing with search, sort, and filter (combined server-side)
  - Sort by: price, name, popularity, average ratings, new arrivals
  - Filter by: category, price range
  - Product detail page with image gallery, breadcrumbs, stock info, and specifications
  - Product recommendations on detail page
  - Wishlist / saved list management
  - Cart with quantity management and stock validation
  - Cart-wishlist sync (adding to cart removes from wishlist)

- **Checkout & Orders**
  - Multi-address management (add/edit/delete)
  - Default address selection at checkout
  - Coupon code application
  - Payment via Razorpay (online) or Cash on Delivery
  - Wallet payments using platform wallet balance
  - Order tracking and detailed order history
  - Order cancellation
  - Return requests

- **Profile**
  - View/edit profile details
  - Change password
  - Wallet balance and transaction history
  - Address book management

---

### 🏪 Seller Features

- **Registration & Auth**
  - Dedicated seller registration with business details (GST/PAN, bank account, IFSC)
  - Seller-specific login portal
  - Category selection during onboarding

- **Product Management**
  - Add, edit, and soft-delete products
  - Product variant management (e.g. size, color) with individual stock per variant
  - Multi-image upload with in-browser image cropping
  - Cloudinary integration for image hosting
  - Minimum 3 images required per product

- **Orders & Returns**
  - View and manage incoming orders
  - Handle return requests from buyers
  - Per-seller order isolation (multi-vendor order support)

- **Financial**
  - Sales analytics dashboard
  - Transaction history
  - Payout tracking

---

### 🔧 Admin Features

- **User Management** — Block/unblock buyers and sellers, search, paginated listing
- **Category Management** — Hierarchical (nested) categories; add/edit/soft-delete; blocking a parent blocks all child categories
- **Product Management** — View all products, block/unblock listings
- **Order Management** — View all orders, update order status
- **Coupon Management** — Create and manage discount coupons
- **Returns Management** — Oversee and approve/reject return requests
- **Sales Analytics** — Platform-wide sales reports and charts
- **Transaction Ledger** — Full audit trail of all platform transactions
- **Wallet Management** — View and manage user wallet balances
- **Payout Management** — Seller payout processing

---

## 🔐 Security Features

| Feature | Implementation |
|---|---|
| Authentication | JWT stored in HTTP-only cookies |
| Password security | bcrypt hashing |
| CSRF Protection | Custom CSRF middleware |
| XSS / Clickjacking | Helmet middleware |
| Brute-force protection | express-rate-limit on login/register routes |
| Route authorization | Role-based middleware (user / seller / admin) |
| Blocked user enforcement | Auth middleware checks block status on each request |
| Input validation | express-validator (server) + regex validation (client + server) |
| Environment secrets | .env files on both client and server |

---

## 📁 Project Structure

### Client (`/client/src`)

```
src/
├── api/            # Axios API modules (one file per domain)
├── components/     # Reusable UI components
│   ├── admin/      # Admin-specific components
│   ├── auth/       # OTP input, verification dialogs
│   ├── Product/    # Product gallery, forms, cropper
│   ├── profile/    # Profile sections (info, orders, wallet, address)
│   ├── seller/     # Seller layout and components
│   └── ui/         # shadcn/ui base components
├── pages/
│   ├── AdminPages/   # Admin panel pages
│   ├── BuyerPages/   # Buyer-facing pages
│   └── SellerPages/  # Seller dashboard pages
├── redux/
│   ├── store.js
│   └── features/   # Slices: cart, wishlist, user, categories
├── routes/         # Role-based protected route wrappers
└── utils/          # Date helpers, validation, script loader
```

### Server (`/server`)

```
server/
├── config/         # DB connection, Cloudinary config
├── controller/     # Business logic (one file per domain)
├── middlewares/    # Auth, error handler, multer, rate limiting
├── models/         # Mongoose schemas
├── routes/         # Express route definitions
└── utils/          # JWT, OTP email, Razorpay, cron jobs, transactions
```

---

## 🗄️ Data Models

| Model | Description |
|---|---|
| `userModel` | Buyer accounts |
| `sellerModel` | Seller accounts with business/bank details |
| `adminModel` | Admin accounts |
| `productModel` | Products with variants, images, categories |
| `categoryModel` | Hierarchical product categories |
| `orderModel` | Orders with multi-seller support |
| `cartModel` | Per-user shopping cart |
| `wishlistModel` | Per-user saved/wishlist |
| `couponModel` | Discount coupons |
| `walletModel` | User wallet balances |
| `returnsModel` | Return requests |
| `otpModel` | Temporary OTP records (TTL-indexed) |
| `adminTransactionModel` | Platform-level transaction log |
| `sellerTransactionModel` | Seller-level transaction log |
| `userAddressModel` | User delivery addresses |

---

## 🔄 API Route Summary

| Prefix | Domain |
|---|---|
| `/api/user` | User auth and profile |
| `/api/seller` | Seller auth and management |
| `/api/admin` | Admin operations |
| `/api/products` | Product CRUD |
| `/api/categories` | Category CRUD |
| `/api/cart` | Cart operations |
| `/api/wishlist` | Wishlist operations |
| `/api/orders` | Order placement and management |
| `/api/coupons` | Coupon management |
| `/api/wallet` | Wallet operations |
| `/api/returns` | Return requests |
| `/api/payouts` | Seller payouts |
| `/api/transactions` | Transaction history |
| `/api/sales` | Sales analytics |
| `/api/dashboard` | Dashboard aggregations |
| `/api/verify` | OTP and email verification |

---

## ⚙️ Environment Variables

### Server (`.env`)

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EMAIL_USER=
EMAIL_PASS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLIENT_URL=
```

### Client (`.env`)

```env
VITE_API_BASE_URL=
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_CLIENT_ID=
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account
- Google OAuth credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/AidrinPeraira/local-shop.git
cd local-shop

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

The client runs on `http://localhost:5173` and the server on the configured `PORT`.

---

## 🧩 Key Implementation Details

- **Lazy loading** — All pages are code-split with `React.lazy` and `Suspense` to reduce initial bundle size.
- **SEO-friendly URLs** — Product slugs used in URLs instead of raw IDs.
- **Server-side pagination** — All listings (products, orders, users) are paginated from the backend.
- **Combined search/sort/filter** — All three operations work together via query parameters sent to the server.
- **Multi-vendor orders** — A single cart checkout can contain products from multiple sellers; each seller sees only their own line items.
- **Transaction ledger** — Every payment, refund, and return generates an immutable transaction record for accounting.
- **Cron jobs** — Scheduled tasks handled via `node-cron` (e.g., OTP expiry cleanup).
- **Image cropping** — Product images are cropped client-side before upload using React Cropper.
- **Soft deletes** — Products and categories are deactivated rather than permanently removed.

---

## 📦 Deployment

- **Frontend**: Vercel (`vercel.json` configured in `/client`)
- **Backend**: Any Node.js hosting provider (Railway, Render, etc.)
- **Database**: MongoDB Atlas
- **Images**: Cloudinary CDN

---

## 📄 License

This project is for educational/portfolio purposes.