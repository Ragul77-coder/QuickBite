import { create } from 'zustand';
import { CartItem, FoodItem, Coupon } from '../types';
import { coupons } from '../data/mockData';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  deliveryFee: number;
  taxRate: number;
  addToCart: (food: FoodItem, restaurantName: string, quantity?: number) => { success: boolean; error?: string };
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getTotals: () => {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
  };
}

const getStoredCart = () => {
  try {
    const savedItems = localStorage.getItem('qb_cart');
    const savedCoupon = localStorage.getItem('qb_coupon');
    return {
      items: savedItems ? JSON.parse(savedItems) : [],
      coupon: savedCoupon ? JSON.parse(savedCoupon) : null,
    };
  } catch (e) {
    return { items: [], coupon: null };
  }
};

const initialCart = getStoredCart();

export const useCartStore = create<CartState>((set, get) => ({
  items: initialCart.items,
  coupon: initialCart.coupon,
  deliveryFee: 2.99,
  taxRate: 0.08, // 8% sales tax

  addToCart: (food, restaurantName, quantity = 1) => {
    const state = get();
    const existingItem = state.items.find(item => item.food.id === food.id);
    
    // Check if food is from same restaurant.
    if (state.items.length > 0 && state.items[0].food.restaurantId !== food.restaurantId) {
      return { 
        success: false, 
        error: `Your cart contains items from "${state.items[0].restaurantName}". Clear your cart to order from "${restaurantName}" instead.`
      };
    }

    let newItems;
    if (existingItem) {
      newItems = state.items.map(item =>
        item.food.id === food.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...state.items, { food, restaurantName, quantity }];
    }

    localStorage.setItem('qb_cart', JSON.stringify(newItems));
    set({ items: newItems });
    return { success: true };
  },

  removeFromCart: (foodId) => {
    set((state) => {
      const newItems = state.items.filter(item => item.food.id !== foodId);
      localStorage.setItem('qb_cart', JSON.stringify(newItems));
      
      // If cart becomes empty, remove coupon as well
      const updatedCoupon = newItems.length === 0 ? null : state.coupon;
      if (newItems.length === 0) {
        localStorage.removeItem('qb_coupon');
      }
      
      return { items: newItems, coupon: updatedCoupon };
    });
  },

  updateQuantity: (foodId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(foodId);
      return;
    }
    set((state) => {
      const newItems = state.items.map(item =>
        item.food.id === foodId ? { ...item, quantity } : item
      );
      localStorage.setItem('qb_cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('qb_cart');
    localStorage.removeItem('qb_coupon');
    set({ items: [], coupon: null });
  },

  applyCoupon: (code) => {
    const couponToApply = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!couponToApply) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    const { subtotal } = get().getTotals();
    if (subtotal < couponToApply.minOrder) {
      return { 
        success: false, 
        message: `Minimum order of $${couponToApply.minOrder.toFixed(2)} required for this coupon.` 
      };
    }

    localStorage.setItem('qb_coupon', JSON.stringify(couponToApply));
    set({ coupon: couponToApply });
    return { success: true, message: `Coupon "${couponToApply.code}" applied successfully!` };
  },

  removeCoupon: () => {
    localStorage.removeItem('qb_coupon');
    set({ coupon: null });
  },

  getTotals: () => {
    const state = get();
    const subtotal = state.items.reduce((acc, item) => acc + (item.food.price * item.quantity), 0);
    const deliveryFee = state.items.length > 0 ? state.deliveryFee : 0;
    const tax = Number((subtotal * state.taxRate).toFixed(2));
    
    let discount = 0;
    if (state.coupon) {
      if (state.coupon.discountType === 'percentage') {
        discount = Number(((subtotal * state.coupon.discount) / 100).toFixed(2));
        if (discount > state.coupon.maxDiscount) {
          discount = state.coupon.maxDiscount;
        }
      } else {
        discount = state.coupon.discount;
      }
    }
    
    const total = Number(Math.max(0, subtotal + deliveryFee + tax - discount).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee,
      tax,
      discount,
      total
    };
  }
}));
