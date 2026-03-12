# 🛒 ShopNest — Full Stack MERN E-Commerce Application

A complete, industry-structured e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring JWT authentication, role-based access control, cart management, and order processing.

---

## 📁 Project Structure

```
ecommerce-project/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── productController.js   # CRUD for products
│   │   ├── cartController.js      # Cart management
│   │   └── orderController.js     # Order processing
│   ├── middleware/
│   │   ├── auth.js                # JWT verification + admin guard
│   │   ├── errorHandler.js        # Global error handler
│   │   └── validate.js            # Input validation middleware
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt)
│   │   ├── Product.js             # Product schema
│   │   ├── Cart.js                # Cart schema
│   │   └── Order.js               # Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   └── seeder.js              # Database seeder script
│   ├── server.js                  # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js + .css
│       │   ├── ProductCard.js + .css
│       │   ├── CartItem.js + .css
│       │   └── Footer.js + .css
│       ├── context/
│       │   ├── AuthContext.js     # Global auth state
│       │   └── CartContext.js     # Global cart state
│       ├── pages/
│       │   ├── HomePage.js        # Product listing + filters
│       │   ├── ProductDetailsPage.js
│       │   ├── CartPage.js
│       │   ├── LoginPage.js
│       │   ├── RegisterPage.js
│       │   ├── CheckoutPage.js
│       │   ├── OrderHistoryPage.js
│       │   └── AdminDashboard.js
│       ├── services/
│       │   └── api.js             # Axios instance + all API calls
│       ├── App.js                 # Routing
│       ├── index.js
│       └── index.css              # Global styles + CSS variables
│
└── README.md
```

---

## ✅ Prerequisites

Install the following before proceeding:

| Software | Version | Download |
|----------|---------|----------|
| Node.js  | v18+    | https://nodejs.org |
| MongoDB  | v6+     | https://www.mongodb.com/try/download/community |
| VS Code  | Latest  | https://code.visualstudio.com |

> **Tip:** Install MongoDB Compass (GUI) for easy database inspection.

---

## 🚀 Setup Instructions

### Step 1 — Clone / Copy the project

Copy the `ecommerce-project/` folder to your desired location and open it in VS Code.

```bash
cd ecommerce-project
code .
```

### Step 2 — Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and verify/update:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=mysupersecretkey_changethisinproduction
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Step 3 — Start MongoDB

**Option A: MongoDB Community Server (local)**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows — MongoDB runs as a service after installation
# Or start manually: mongod --dbpath "C:\data\db"
```

**Option B: MongoDB Atlas (cloud - free tier)**
1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Get your connection string and replace `MONGO_URI` in `.env`

### Step 4 — Install Backend Dependencies

```bash
# From the project root
cd backend
npm install
```

### Step 5 — Seed the Database

```bash
# While still in the backend folder
npm run seed
```

This creates:
- **Admin user:** `admin@ecommerce.com` / `admin123`
- **Regular user:** `john@example.com` / `password123`
- **12 sample products** across all categories

### Step 6 — Start the Backend Server

```bash
# Development mode (auto-restart with nodemon)
npm run dev

# OR production mode
npm start
```

✅ You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
📡 API: http://localhost:5000/api
```

### Step 7 — Install Frontend Dependencies

Open a **new terminal** in VS Code:

```bash
cd frontend
npm install
```

### Step 8 — Start the Frontend

```bash
npm start
```

The app will automatically open at **http://localhost:3000**

---

## 🔐 Test Credentials

| Role  | Email                    | Password     |
|-------|--------------------------|--------------|
| Admin | admin@ecommerce.com      | admin123     |
| User  | john@example.com         | password123  |

> The Login page also has clickable credential chips that auto-fill the form for quick testing.

---

## 🌐 API Reference

### Authentication
| Method | Endpoint              | Access  | Description |
|--------|-----------------------|---------|-------------|
| POST   | /api/auth/register    | Public  | Create account |
| POST   | /api/auth/login       | Public  | Login |
| GET    | /api/auth/me          | Private | Get own profile |

### Products
| Method | Endpoint              | Access       | Description |
|--------|-----------------------|--------------|-------------|
| GET    | /api/products         | Public       | Get all (supports ?category=&search=&sort=&page=&limit=) |
| GET    | /api/products/:id     | Public       | Get single product |
| POST   | /api/products         | Admin        | Create product |
| PUT    | /api/products/:id     | Admin        | Update product |
| DELETE | /api/products/:id     | Admin        | Delete product |

### Cart
| Method | Endpoint              | Access  | Description |
|--------|-----------------------|---------|-------------|
| GET    | /api/cart             | Private | Get user cart |
| POST   | /api/cart/add         | Private | Add item |
| PUT    | /api/cart/update      | Private | Update quantity |
| DELETE | /api/cart/remove      | Private | Remove item |
| DELETE | /api/cart/clear       | Private | Clear cart |

### Orders
| Method | Endpoint              | Access  | Description |
|--------|-----------------------|---------|-------------|
| POST   | /api/orders           | Private | Place order (clears cart) |
| GET    | /api/orders/user      | Private | Get own orders |
| GET    | /api/orders/:id       | Private | Get single order |
| GET    | /api/orders           | Admin   | Get all orders |
| PUT    | /api/orders/:id/status| Admin   | Update order status |

---

## 🛠️ Adding Products Manually (Admin Dashboard)

1. Login with admin credentials
2. Click **"Admin"** in the navbar
3. Click **"+ Add Product"** button
4. Fill in the form with product details
5. Use any image URL (Unsplash works great: `https://images.unsplash.com/photo-xxx?w=400`)

---

## 🔧 Environment Variables Reference

| Variable     | Required | Description |
|--------------|----------|-------------|
| PORT         | No       | Server port (default: 5000) |
| NODE_ENV     | No       | development or production |
| MONGO_URI    | **Yes**  | MongoDB connection string |
| JWT_SECRET   | **Yes**  | Secret key for JWT signing |
| JWT_EXPIRE   | No       | Token expiry (default: 7d) |
| CLIENT_URL   | No       | Frontend URL for CORS |

---

## 🎯 Features Summary

### User Features
- ✅ Register & Login with JWT authentication
- ✅ Browse products with category filters, search, and sort
- ✅ View individual product details
- ✅ Add/remove/update items in cart
- ✅ Checkout with shipping address
- ✅ View order history with expandable details

### Admin Features
- ✅ Admin dashboard with key metrics
- ✅ Create, edit, and delete products
- ✅ View all customer orders
- ✅ Update order status (Pending → Processing → Shipped → Delivered)

---

## 🐛 Troubleshooting

**MongoDB connection fails:**
- Make sure MongoDB is running: `mongod` command or check services
- Verify `MONGO_URI` in your `.env` file

**CORS errors:**
- Confirm `CLIENT_URL` in `.env` matches your React app URL (default: `http://localhost:3000`)
- Ensure backend is running on port 5000

**Port already in use:**
- Change `PORT=5001` in `.env` and update frontend proxy in `frontend/package.json`

**npm install fails:**
- Delete `node_modules` and `package-lock.json`, then retry
- Ensure Node.js v18+ is installed: `node --version`

**"Cannot GET /api/...":**
- Verify backend is running and visit `http://localhost:5000/api/health`

---

## 📚 Tech Stack

| Layer      | Technology |
|------------|-----------|
| Frontend   | React 18, React Router v6, Axios, React Toastify |
| Backend    | Node.js, Express.js 4 |
| Database   | MongoDB with Mongoose ODM |
| Auth       | JSON Web Tokens (JWT), bcryptjs |
| Validation | express-validator |
| Styling    | Custom CSS with CSS Variables |

---

Built with ❤️ using the MERN Stack
