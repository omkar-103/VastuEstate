# 🏠 Swayam - Premium Indian Real Estate Platform (VastuEstate)

Swayam is a next-generation real estate platform specifically designed for the Indian market, built with the MERN stack. It features a modern, luxury-oriented UI, Razorpay-integrated subscription access models, and Vastu-compliant property filtering.

---

## 🏗️ Project Architecture Overview

The project is structured as a full-stack **MERN** application:
- **MongoDB**: Used for data persistence via Mongoose schemas.
- **Express / Node.js**: Powers the backend API in the `server` directory.
- **React (Vite)**: Powers the frontend UI in the `client` directory.

### 💳 Subscription Model (Razorpay)
Instead of a one-time property buying model, Swayam uses a tiered subscription system (Free, Standard, Premium). 
- **Free Users**: Have limited access. 50% of properties are locked with a "Premium Exclusive" overlay. Owner contact details (phone/email) are hidden.
- **Standard / Premium Users**: Can view all properties and owner contact details.

---

## 📁 File Structure & Explanations

### 🖥️ 1. Client (Frontend)
Located in `/client`. Built with React, Vite, Tailwind CSS v4, Lucide React, and Framer Motion.

#### `src/` Directory
- **`App.jsx`**: The main routing component using `react-router-dom`. Defines all the public and protected routes across the application.
- **`main.jsx`**: The React entry point that mounts the application to the DOM.
- **`index.css` / `App.css`**: Global stylesheet containing Tailwind configurations and custom luxury-themed utility classes.

#### `src/components/`
- **`Navbar.jsx`**: The responsive top navigation bar. Displays the current user's subscription tier, login/logout buttons, and an "Upgrade Plan" CTA.
- **`Footer.jsx`**: The global footer for the application.

#### `src/context/`
- **`AuthContext.jsx`**: Global state management for user authentication. Handles login, registration, logout, and locally updating user attributes (like `subscriptionPlan`) without a page refresh.

#### `src/pages/`
- **`Home.jsx`**: The highly-animated landing page emphasizing Vastu compliance, luxury design, and location search logic.
- **`Login.jsx` & `Register.jsx`**: Authentication screens securely tied to the backend JWT system.
- **`Pricing.jsx`**: The subscription upgrade page. Features the three pricing tiers and handles the entire Razorpay checkout flow natively.
- **`Properties.jsx`**: The main property listing page. If the user is on the Free tier, "Premium Exclusive" glassmorphism overlays dynamically lock some properties.
- **`PropertyDetail.jsx`**: The expanded view for a single property. Hides the "Call Now/Email" buttons for Free users, replacing them with an "Unlock Details" CTA.
- **`AdminDashboard.jsx`**: A protected command center for administrators. Displays platform statistics, recent properties, and a table of all registered users with their current Subscription Tier badges.
- **`Profile.jsx`, `Wishlist.jsx`, `AddProperty.jsx`**: Additional user management and property creation pages.

---

### ⚙️ 2. Server (Backend)
Located in `/server`. Built with Node.js and Express.

#### Core Files
- **`index.js`**: The main entry point for the backend. Configures middleware, connects to MongoDB, and registers all API routes (`/api/auth`, `/api/properties`, `/api/subscription`).
- **`seed.js`**: A database seeding script that populates the DB with 9 premium Indian properties and creates a default Admin user (`admin@swayam.com`).

#### `models/` (Database Schemas)
- **`User.js`**: Defines the user schema. Includes fields for `role` (admin/buyer/seller), `subscriptionPlan` (Free/Standard/Premium), and `razorpaySubscriptionId`. Uses `bcryptjs` for pre-save password hashing.
- **`Property.js`**: Defines the property schema (type, area, price, location, features). Includes an `owner` reference to the User collection.

#### `controllers/` (Business Logic)
- **`authController.js`**: Handles user registration, login (JWT generation), fetching the current user profile, and heavily protected functions like `getAllUsers` for the Admin Dashboard.
- **`propertyController.js`**: Contains the CRUD logic for properties. *Crucially*, it inspects the user's JWT token—if the user is on the Free plan, it scrubs owner contact details from the API response and sets an `isLocked` flag on 50% of the properties before sending them to the client.
- **`subscriptionController.js`**: Manages the Razorpay integration. Includes `createOrder` to generate a secure Razorpay order ID, and `verifyPayment` to cryptographically validate the Razorpay signature and upgrade the user's plan in MongoDB.

#### `routes/` (API Endpoints)
- **`authRoutes.js`**: Maps endpoints like `POST /login` and `GET /` (admin only) to their respective controller functions.
- **`propertyRoutes.js`**: Maps endpoints for getting, creating, and updating properties.
- **`subscriptionRoutes.js`**: Maps the `POST /create-order` and `POST /verify-payment` endpoints.

#### `middleware/`
- **`authMiddleware.js`**: Contains the `protect` function (verifies the JWT token and attaches the `req.user` context) and the `authorize` function (role-based access control, e.g., restricting routes to `admin` only).

---

## 🔑 Demo Credentials
Access the platform with these pre-configured credentials (run `node seed.js` in the `/server` directory first):
- **Email:** `admin@swayam.com`
- **Password:** `swayam123`

## 🚀 Getting Started

1. **Setup Environment**
   Update the `.env` file in the `/server` directory with your MongoDB Atlas URI, JWT Secret, and Razorpay Keys (or leave Razorpay keys empty/mocked to test the bypass).
   
2. **Setup Database**
   Seed the database with default properties and the admin user:
   ```bash
   cd server
   node seed.js
   ```

3. **Install & Run**
   Open two terminal windows:
   ```bash
   # Terminal 1: Start Backend
   cd server
   npm install
   npm run dev
   
   # Terminal 2: Start Frontend
   cd client
   npm install
   npm run dev
   ```
