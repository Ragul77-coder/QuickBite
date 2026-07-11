import { AdminStats, RevenueData, AdminOrder } from '../types';

export const adminStats: AdminStats = {
  totalOrders: 1284,
  totalRevenue: 28450.90,
  totalUsers: 843,
  totalRestaurants: 12,
  ordersChange: 12.5, // % change compared to last period
  revenueChange: 18.2, // % change compared to last period
  usersChange: 8.4, // % change compared to last period
  restaurantsChange: 0, // % change compared to last period
};

export const revenueAnalytics: RevenueData[] = [
  { month: 'Jan', revenue: 18500, orders: 820 },
  { month: 'Feb', revenue: 20400, orders: 910 },
  { month: 'Mar', revenue: 22100, orders: 980 },
  { month: 'Apr', revenue: 24500, orders: 1100 },
  { month: 'May', revenue: 27800, orders: 1220 },
  { month: 'Jun', revenue: 28450, orders: 1284 },
];

export const adminOrdersList: AdminOrder[] = [
  { id: 'ord-9821', customer: 'John Doe', restaurant: 'The Golden Grill', items: 3, total: 35.76, status: 'delivered', date: '2026-07-09', paymentMethod: 'Credit Card' },
  { id: 'ord-1244', customer: 'John Doe', restaurant: 'Pasta Paradise', items: 1, total: 22.50, status: 'preparing', date: '2026-07-11', paymentMethod: 'Google Pay' },
  { id: 'ord-4412', customer: 'Jane Smith', restaurant: 'Sakura Sushi House', items: 2, total: 29.98, status: 'placed', date: '2026-07-11', paymentMethod: 'Cash on Delivery' },
  { id: 'ord-8831', customer: 'Robert Johnson', restaurant: 'Spice Route', items: 4, total: 54.20, status: 'confirmed', date: '2026-07-10', paymentMethod: 'Credit Card' },
  { id: 'ord-3321', customer: 'Emily Davis', restaurant: 'Dragon Wok', items: 2, total: 21.98, status: 'out_for_delivery', date: '2026-07-11', paymentMethod: 'Apple Pay' },
  { id: 'ord-0912', customer: 'William Brown', restaurant: 'Taco Fiesta', items: 5, total: 43.50, status: 'delivered', date: '2026-07-08', paymentMethod: 'Google Pay' },
  { id: 'ord-6721', customer: 'Michael Miller', restaurant: 'Mediterranean Breeze', items: 3, total: 37.96, status: 'cancelled', date: '2026-07-07', paymentMethod: 'Credit Card' },
];
