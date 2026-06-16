
# 🍽️ FoodFlow – Skip the Queue. Order Smart.

FoodFlow is a **Campus Dining Platform** that lets students browse menus from all campus food outlets, place orders instantly, and track their food in real-time — all from their phone.

---

## Table of Contents
- [Introduction](#introduction)
- [Objective](#objective)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)
- [License](#license)

---

## Introduction

FoodFlow is a full-stack web application designed to simplify campus dining. Students can explore multiple food outlets, add items to cart, place orders, and track order status in real-time. Admins can manage their outlets, menus, and incoming orders through a dedicated portal.

---

## Objective

To eliminate long queues and manual ordering at campus food outlets by providing a seamless digital ordering experience for students and a powerful management dashboard for outlet admins.

---

## Features

### 🎓 Student Portal
- Browse menus from multiple campus food outlets (Snapeats, Southern Stories, Green Nox, and more)
- Add items to cart and place orders instantly
- Real-time order tracking — Preparing → Ready → Out for Delivery
- Student Sign Up / Sign In with secure authentication

### 🛠️ Admin Portal
- Admin Sign In to manage outlet operations
- Manage menu items, categories, and availability
- View and update incoming orders in real-time
- Register new food outlets

### 🏠 Landing Page
- Overview of all campus food outlets
- How It Works section (Browse → Order → Track)
- Quick Access links for Student Login, Admin Login, Register, and Register Outlet

---

## Tech Stack

**Frontend:**
- React 19, React Router DOM
- Vite
- TailwindCSS

**Backend:**
- Node.js, Express.js
- MongoDB (Mongoose)
- JWT Authentication (jsonwebtoken)
- bcrypt (password hashing)
- Razorpay (payment integration)
- CORS, dotenv

**Database & Auth:**
- MongoDB
- Supabase

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or Atlas)
- Supabase project

### Installation

**Clone the repository:**
```bash
git clone https://github.com/Mahimachandna28/Food-Flow.git
cd Food-Flow
```

**Setup Backend:**
```bash
cd backend
npm install
# Create a .env file with your MongoDB URI, JWT secret, Razorpay keys, Supabase URL & key
npm start
```

**Setup Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Repository Structure

```
Food-Flow/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/     # Landing, Auth, Student, Admin pages
│   │   ├── components/
│   │   └── main.jsx
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── package.json
└── README.md
```

---

## License

This project is licensed under the MIT License.

---

> Built for scale. Built for speed. Built for the modern campus. 🚀
