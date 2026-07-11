# 🍔 QuickBite - Food Ordering Web Application

QuickBite is a modern, premium, production-ready, full-stack style Food Ordering Web Application built using React, TypeScript, Zustand, and Tailwind CSS. The app operates as a frontend-only platform using mock JSON data structure and browser state management.

🔗 **Live Demo**: [https://ragul77-coder.github.io/QuickBite/](https://ragul77-coder.github.io/QuickBite/) · **Code**: [https://github.com/Ragul77-coder/QuickBite](https://github.com/Ragul77-coder/QuickBite)

---

## ✨ Features

### 🌐 Public Front-End
* **Landing Page**: Fully detailed hero header, global food/restaurant search, category selectors, trending cuisines, and customer testimonials.
* **Restaurant Listings**: Filter restaurants by minimum rating, delivery times (using a range slider), cuisine tags, and alphabetical sorts.
* **Restaurant Detail**: Menu categorization tabs, item grid lists, dietary badges (Veg/Non-Veg), and customer reviews.
* **Global Food Search**: Instant suggestions and filters to find dishes across all active partners.
* **Shopping Cart**: Real-time tax/GST calculations, shipping fees, promo code coupons, and cross-restaurant checks (locks order to one merchant).
* **Direct Checkout**: Toggle between selecting saved addresses or entering a new delivery address directly on the screen. Supports multiple payment modes (Credit Card, Google Pay, COD).
* **Animated Success & Tracking**: Order placement triggers an animated success state and forwards to a live tracking timeline with progress updates.

### 👤 User Section
* **Simulated OTP Logins**: Login & Registration flows include OTP input page transitions.
* **Profile Dashboard**: Add/remove multiple delivery addresses, reorder items from past orders, view favorited restaurants/foods, and set notification parameters.

### 📊 Merchant & Admin Console (`/admin`)
* **Overview Analytics**: Dynamic revenue charts (using Recharts) and progress indicators for monthly targets.
* **Orders Control**: Live order list status modifiers.
* **Partners & Items CRUD**: Create, read, update, and delete restaurants and menu items inside responsive modal forms.
* **Coupon Manager**: Configure new discount codes (percentage/fixed value discounts) and toggle active states.
* **Riders & Users list**: Real-time availability tracking for delivery partners and roles administration.
* **Reports**: Live generation and downloading of CSV performance metrics.

---

## 🛠️ Tech Stack & Libraries

* **Core**: [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Navigation**: [React Router DOM v7](https://reactrouter.com/)
* **State Stores**: [Zustand v5](https://zustand-demo.pmnd.rs/) with Local Storage persistence
* **Animations**: [Framer Motion v12](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Data Visuals**: [Recharts v3](https://recharts.org/)
* **Alert Notifications**: [React Hot Toast](https://react-hot-toast.com/)

---

## 📁 Project Directory Structure

```bash
src/
├── types/          # Strict TS declarations (Restaurant, FoodItem, Order, User, etc.)
├── data/           # Mock seeds (restaurants, foods, reports, reviews)
├── store/          # Zustand state layers with localStorage sync
├── components/     
│   ├── ui/         # Reusable design atoms (Button, Card, Modal, Input, Badge, Table, etc.)
│   └── common/     # Global Navigation, Footer, Notification dropdown panel
├── layouts/        # Root Client Layout and Sidebar Admin Console frame
├── pages/          # App views (Landing, Listing, Cart, Checkout, OTP, Profiles, Tracking)
│   └── admin/      # Management dashboards (Overview, CRUD tables, coupons)
├── index.css       # Tailwind 4 directives and design variables (glassmorphism classes)
└── main.tsx        # React Router browser declarations
```

---

## 🚀 Running the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates static assets inside the `dist/` folder.
