import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Layouts
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { RestaurantListingPage } from './pages/RestaurantListingPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { FoodSearchPage } from './pages/FoodSearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

// User Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminOrderManagement } from './pages/admin/AdminOrderManagement';
import { RestaurantManagement } from './pages/admin/RestaurantManagement';
import { FoodManagement } from './pages/admin/FoodManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { CouponManagement } from './pages/admin/CouponManagement';
import { DeliveryManagement } from './pages/admin/DeliveryManagement';
import { ReportsSection } from './pages/admin/ReportsSection';
import { AdminSettings } from './pages/admin/AdminSettings';

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '', element: <LandingPage /> },
      { path: 'restaurants', element: <RestaurantListingPage /> },
      { path: 'restaurant/:id', element: <RestaurantDetailPage /> },
      { path: 'search', element: <FoodSearchPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-success/:id', element: <OrderSuccessPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'track-order/:id', element: <OrderTrackingPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <AdminOverview /> },
      { path: 'orders', element: <AdminOrderManagement /> },
      { path: 'restaurants', element: <RestaurantManagement /> },
      { path: 'foods', element: <FoodManagement /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'coupons', element: <CouponManagement /> },
      { path: 'deliveries', element: <DeliveryManagement /> },
      { path: 'reports', element: <ReportsSection /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
