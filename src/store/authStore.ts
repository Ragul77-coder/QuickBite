import { create } from 'zustand';
import { User, Address, Order } from '../types';
import { mockUser, mockOrders } from '../data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  orders: Order[];
  wishlist: { foodIds: string[]; restaurantIds: string[] };
  login: (email: string, name?: string) => boolean;
  signup: (name: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateProfile: (name: string, phone: string, email: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  toggleFavoriteFood: (foodId: string) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const getStoredAuth = () => {
  try {
    const savedUser = localStorage.getItem('qb_user');
    const savedOrders = localStorage.getItem('qb_orders');
    const savedWishlist = localStorage.getItem('qb_wishlist');
    
    return {
      user: savedUser ? JSON.parse(savedUser) : mockUser,
      isAuthenticated: !!savedUser,
      orders: savedOrders ? JSON.parse(savedOrders) : mockOrders,
      wishlist: savedWishlist ? JSON.parse(savedWishlist) : { foodIds: [], restaurantIds: [] }
    };
  } catch (e) {
    return {
      user: mockUser,
      isAuthenticated: false,
      orders: mockOrders,
      wishlist: { foodIds: [], restaurantIds: [] }
    };
  }
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  isAuthenticated: initialAuth.isAuthenticated,
  orders: initialAuth.orders,
  wishlist: initialAuth.wishlist,

  login: (email: string, name?: string) => {
    // Fake login
    const newUser: User = {
      id: 'u1',
      name: name || 'John Doe',
      email: email,
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      addresses: [
        { id: 'a1', label: 'Home', street: '128 Birchwood Dr', city: 'Metroville', state: 'NY', zipCode: '10001', isDefault: true },
        { id: 'a2', label: 'Office', street: '450 Lexington Ave, Fl 12', city: 'New York', state: 'NY', zipCode: '10017', isDefault: false },
      ],
      joinedDate: 'Jul 2026',
    };
    localStorage.setItem('qb_user', JSON.stringify(newUser));
    set({ user: newUser, isAuthenticated: true });
    return true;
  },

  signup: (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      addresses: [],
      joinedDate: 'Jul 2026',
    };
    localStorage.setItem('qb_user', JSON.stringify(newUser));
    set({ user: newUser, isAuthenticated: true });
    return true;
  },

  logout: () => {
    localStorage.removeItem('qb_user');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (name: string, phone: string, email: string) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, name, phone, email };
      localStorage.setItem('qb_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  addAddress: (addressData) => {
    set((state) => {
      if (!state.user) return state;
      const newAddress: Address = {
        ...addressData,
        id: `addr-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      let addresses = [...state.user.addresses];
      if (newAddress.isDefault) {
        addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
      }
      addresses.push(newAddress);
      
      const updatedUser = { ...state.user, addresses };
      localStorage.setItem('qb_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  deleteAddress: (id) => {
    set((state) => {
      if (!state.user) return state;
      const addresses = state.user.addresses.filter(addr => addr.id !== id);
      if (addresses.length > 0 && !addresses.some(addr => addr.isDefault)) {
        addresses[0].isDefault = true;
      }
      const updatedUser = { ...state.user, addresses };
      localStorage.setItem('qb_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  toggleFavoriteFood: (foodId) => {
    set((state) => {
      const foodIds = [...state.wishlist.foodIds];
      const index = foodIds.indexOf(foodId);
      if (index > -1) {
        foodIds.splice(index, 1);
      } else {
        foodIds.push(foodId);
      }
      const wishlist = { ...state.wishlist, foodIds };
      localStorage.setItem('qb_wishlist', JSON.stringify(wishlist));
      return { wishlist };
    });
  },

  toggleFavoriteRestaurant: (restaurantId) => {
    set((state) => {
      const restaurantIds = [...state.wishlist.restaurantIds];
      const index = restaurantIds.indexOf(restaurantId);
      if (index > -1) {
        restaurantIds.splice(index, 1);
      } else {
        restaurantIds.push(restaurantId);
      }
      const wishlist = { ...state.wishlist, restaurantIds };
      localStorage.setItem('qb_wishlist', JSON.stringify(wishlist));
      return { wishlist };
    });
  },

  addOrder: (order) => {
    set((state) => {
      const updatedOrders = [order, ...state.orders];
      localStorage.setItem('qb_orders', JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => {
      const updatedOrders = state.orders.map((order) => {
        if (order.id === orderId) {
          const updatedTimeline = [...order.timeline];
          // Find index matching the state and update completed
          const statusMap: Record<string, string> = {
            placed: 'Order Placed',
            confirmed: 'Confirmed',
            preparing: 'Preparing',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
          };
          const text = statusMap[status];
          if (text) {
            let found = false;
            for (let i = 0; i < updatedTimeline.length; i++) {
              if (updatedTimeline[i].status.toLowerCase().includes(status.replace(/_/g, ' ')) || updatedTimeline[i].status === text) {
                updatedTimeline[i].completed = true;
                updatedTimeline[i].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                found = true;
              }
              // Mark all previous as completed
              if (!found) {
                updatedTimeline[i].completed = true;
                if (!updatedTimeline[i].time || updatedTimeline[i].time === '--') {
                  updatedTimeline[i].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
              }
            }
          }
          return { ...order, status, timeline: updatedTimeline };
        }
        return order;
      });
      localStorage.setItem('qb_orders', JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });
  },
}));
