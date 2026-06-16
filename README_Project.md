# FoodFlow - Smart Campus Dining Platform

Welcome to **FoodFlow**, an integrated, real-time campus food ordering and management system. FoodFlow bridges the gap between students and campus food outlets, ensuring swift order placements, seamless order state tracking, and a powerful administrative dashboard for outlet managers.

---

## 🌟 Non-Technical Overview

### What is FoodFlow?
FoodFlow is a digital dining experience tailored exclusively for campus environments. Instead of waiting in long lines or walking between different campus restaurants to see what's available, students can use FoodFlow to view menus across various outlets (e.g., *Snapeats*, *Southern Stories*, *Green Nox*), place orders, and track when their food is ready for pickup or out for delivery.

### Key Features for Users (Students/Faculty)
- **Centralized Menu Browsing**: Access real-time menus from all campus dining outlets in one consolidated, sleek interface.
- **Dynamic Cart**: Add, update, or remove items easily. See real-time cart statistics without navigating away from the menu.
- **Live Order Tracking**: A step-by-step visual tracker (Preparing ➔ Ready ➔ Out for Delivery ➔ Delivered) so you always know the exact status of your food.
- **Order History**: Review past orders, invoices, and re-order preferences effortlessly.

### Key Features for Admins (Outlet Managers)
- **Real-Time Dashboard**: See total active orders, what is currently preparing, and what is ready.
- **One-Click Order Management**: Advance order statuses directly from a dedicated dashboard interface.
- **Menu Management**: Instantly add new items, update prices, change descriptions, or mark items as temporarily 'Unavailable' with a single toggle.

---

## 💻 Technical Architecture & Implementation

FoodFlow is built on a modern **MERN (MongoDB, Express, React, Node.js)** architecture, augmented with **Supabase** for secure, lightning-fast authentication.

### Core Stack
1. **Frontend**: React (v19) via Vite, React Router DOM (v7) for client-side routing.
2. **Backend**: Node.js & Express.js for the REST API.
3. **Database**: MongoDB (via Mongoose) for highly flexible schema management of Menus and Orders.
4. **Authentication**: Supabase (PostgreSQL-backed) handling secure JWT issuance, user policies, and role-based access control (Admin vs User).

### Data Flow & State Management
- **Auth Context (`AuthContext.jsx`)**: Synchronizes Supabase session state globally. Fetches custom user metadata (like roles and assigned outlets) via the `profiles` table.
- **Cart Context (`CartContext.jsx`)**: Manages local, ephemeral shopping cart states. Performs instant quantity aggregations and sub-total calculations locally before submitting a formalized JSON payload to the backend.
- **API Strategy (`lib/api.js`)**: Encapsulates all backend `fetch` logic. Ensures consistent headers, error propagation, and query parameter serialization for both `foodAPI` and `orderAPI`.

### Schema Design (MongoDB)
- **Food Model**: Contains `name`, `price`, `category`, `description`, `outlet_name`, and a boolean `available` status wrapper. Time-stamped for easy sorting.
- **Order Model**: Strictly typed enum schemas `['Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']`. Stores a rich snapshot of ordered items (`foodId`, `name`, `price`, `quantity`) at the time of purchase to prevent historical pricing conflicts.

---

## 🚀 Setup & Local Environment Instructions

The application is split into two primary directories: `/frontend` and `/backend`.

### 1. Database Configuration
1. Open the `/backend/.env` file.
2. Ensure you have the `MONGO_URI` variable set. If you wish to use an online database (like MongoDB Atlas), you should provide the appropriate string there.
*(Note: A `seed.js` script is provided to pre-populate your live or local database. If you use Atlas, simply running the script while the Atlas URI is active will sync the mocked data to the cloud.)*

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   npm install
   ```
2. **[Optional]** Seed initial food items into the database to quickly populate the menu:
   ```bash
   node seed.js
   ```
3. Start the Express server:
   ```bash
   npm run start
   # or
   node server.js
   ```
   *The backend will boot up on normally on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   npm install
   ```
2. Verify that your Supabase keys exist inside `/frontend/.env` (e.g., `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. Running the Complete App
- For standard users, access `http://localhost:5173/user/signin`. (Upon signup, the default role is `user`).
- For administrators, access `http://localhost:5173/admin/signin`. When signing up as an Admin, you will be prompted to select the specific Outlet you manage.

---

## 🎨 UI & UX Design Philosophy
The entire user interface was architected using **Google Material Design** principles:
1. **Z-Index & Shadow Hierarchies**: Subtle `box-shadows` indicate interactivity and depth (e.g., lifting product cards gently on hover).
2. **Clean Typography**: We leverage `Inter`/`System-UI` defaults. Muted gray strings (`#5f6368`) deprioritize secondary data while primary blue (`#1a73e8`) aggressively highlights call-to-actions.
3. **Optimized Spacing**: Forms utilize a grid gap system with 8px radius borders. Input paddings afford generous 'hit areas' ideal for mobile campus users scaling interfaces dynamically.
4. **State Introspection**: Beautiful, visual pipeline step-trackers actively guide users on their order status, eliminating "Is my food ready yet?" anxiety.

---
*Built for scale. Built for speed. Built for the modern campus.*
