// ============================================
// Core Type Definitions for QuickBite Platform
// ============================================

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  coverImage: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  distance: string;
  isOpen: boolean;
  isFeatured: boolean;
  address: string;
  description: string;
  promo?: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isPopular: boolean;
  isBestseller: boolean;
  customizations?: Customization[];
}

export interface Customization {
  name: string;
  options: { label: string; price: number }[];
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  restaurantName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  joinedDate: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  restaurant: { id: string; name: string; image: string };
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
  deliveryPartner?: DeliveryPartner;
  timeline: OrderTimeline[];
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTimeline {
  status: string;
  time: string;
  description: string;
  completed: boolean;
}

export interface DeliveryPartner {
  name: string;
  phone: string;
  avatar: string;
  vehicle: string;
  rating: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  foodId?: string;
  restaurantId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  description: string;
  validUntil: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'system';
  read: boolean;
  createdAt: string;
  icon?: string;
}

// Admin types
export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalRestaurants: number;
  ordersChange: number;
  revenueChange: number;
  usersChange: number;
  restaurantsChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  restaurant: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
}
