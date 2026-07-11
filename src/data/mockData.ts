import { Category, Coupon, Review, User, Order, Notification } from '../types';

export const categories: Category[] = [
  { id: 'cat1', name: 'Burgers', icon: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop', count: 18 },
  { id: 'cat2', name: 'Sushi', icon: 'Japanese', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop', count: 12 },
  { id: 'cat3', name: 'Pizza', icon: 'Pizza', image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=100&h=100&fit=crop', count: 15 },
  { id: 'cat4', name: 'Curry', icon: 'Flame', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100&h=100&fit=crop', count: 9 },
  { id: 'cat5', name: 'Noodles', icon: 'Soup', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop', count: 11 },
  { id: 'cat6', name: 'Desserts', icon: 'Cookie', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop', count: 14 },
  { id: 'cat7', name: 'Salads', icon: 'Salad', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=100&h=100&fit=crop', count: 8 },
  { id: 'cat8', name: 'Beverages', icon: 'CupSoda', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=100&h=100&fit=crop', count: 22 },
];

export const coupons: Coupon[] = [
  { id: 'c1', code: 'WELCOME20', discount: 20, discountType: 'percentage', minOrder: 15, maxDiscount: 10, description: '20% OFF up to $10 on your first order', validUntil: '2026-12-31', isActive: true },
  { id: 'c2', code: 'FREEFEE', discount: 5, discountType: 'fixed', minOrder: 20, maxDiscount: 5, description: 'Free delivery fee discount of $5 for orders over $20', validUntil: '2026-09-30', isActive: true },
  { id: 'c3', code: 'SPICEITUP', discount: 15, discountType: 'percentage', minOrder: 25, maxDiscount: 8, description: '15% OFF up to $8 on Curries & Biryanis', validUntil: '2026-08-31', isActive: true },
  { id: 'c4', code: 'PIZZAPARTY', discount: 3, discountType: 'fixed', minOrder: 18, maxDiscount: 3, description: '$3 OFF on all Pizza Planet orders', validUntil: '2026-10-31', isActive: true },
];

export const mockUser: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 019-2834',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
  addresses: [
    { id: 'a1', label: 'Home', street: '128 Birchwood Dr', city: 'Metroville', state: 'NY', zipCode: '10001', isDefault: true },
    { id: 'a2', label: 'Office', street: '450 Lexington Ave, Fl 12', city: 'New York', state: 'NY', zipCode: '10017', isDefault: false },
  ],
  joinedDate: 'Oct 2024',
};

export const reviews: Review[] = [
  { id: 'rev1', userId: 'u2', userName: 'Alice Smith', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', rating: 5, comment: 'The Classic Smash Burger was absolutely legendary! Hot, juicy, and arrived in less than 20 minutes.', date: '2026-07-01', restaurantId: 'r1', foodId: 'f1' },
  { id: 'rev2', userId: 'u3', userName: 'David Miller', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', rating: 4, comment: 'Sushi was incredibly fresh. Will definitely order the Rainbow Roll again!', date: '2026-07-05', restaurantId: 'r2', foodId: 'f6' },
  { id: 'rev3', userId: 'u4', userName: 'Emily Watson', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', rating: 5, comment: 'Nonna would be proud! The Truffle Pasta is to die for.', date: '2026-07-08', restaurantId: 'r3', foodId: 'f11' },
  { id: 'rev4', userId: 'u5', userName: 'Michael Chang', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', rating: 3, comment: 'Tacos were nice but the delivery was slightly delayed. Overall, okay experience.', date: '2026-07-10', restaurantId: 'r7', foodId: 'f28' },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-9821',
    userId: 'u1',
    restaurant: { id: 'r1', name: 'The Golden Grill', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop' },
    items: [
      {
        food: { id: 'f1', restaurantId: 'r1', name: 'Classic Smash Burger', description: 'Double beef patty, cheddar, lettuce, tomato, special sauce on a brioche bun', price: 12.99, image: '', category: 'Burgers', rating: 4.7, reviewCount: 89, isVeg: false, isPopular: true, isBestseller: true },
        quantity: 2,
        restaurantName: 'The Golden Grill',
      },
      {
        food: { id: 'f3', restaurantId: 'r1', name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, jalapeños, sour cream', price: 8.99, image: '', category: 'Sides', rating: 4.3, reviewCount: 45, isVeg: true, isPopular: false, isBestseller: false },
        quantity: 1,
        restaurantName: 'The Golden Grill',
      }
    ],
    status: 'delivered',
    subtotal: 34.97,
    deliveryFee: 2.99,
    tax: 2.80,
    discount: 5.00,
    total: 35.76,
    deliveryAddress: { id: 'a1', label: 'Home', street: '128 Birchwood Dr', city: 'Metroville', state: 'NY', zipCode: '10001', isDefault: true },
    paymentMethod: 'Credit Card',
    createdAt: '2026-07-09T18:30:00Z',
    estimatedDelivery: '2026-07-09T19:05:00Z',
    deliveryPartner: { name: 'Alex Johnson', phone: '+1 (555) 012-3456', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop', vehicle: 'E-Bike (Black)', rating: 4.9 },
    timeline: [
      { status: 'Order Placed', time: '06:30 PM', description: 'Your order was successfully placed.', completed: true },
      { status: 'Confirmed', time: '06:32 PM', description: 'Restaurant has accepted your order.', completed: true },
      { status: 'Preparing', time: '06:35 PM', description: 'Our chef is preparing your delicious meal.', completed: true },
      { status: 'Out for Delivery', time: '06:50 PM', description: 'Rider is on the way to your location.', completed: true },
      { status: 'Delivered', time: '07:05 PM', description: 'Order delivered. Enjoy your food!', completed: true },
    ]
  },
  {
    id: 'ord-1244',
    userId: 'u1',
    restaurant: { id: 'r3', name: 'Pasta Paradise', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop' },
    items: [
      {
        food: { id: 'f11', restaurantId: 'r3', name: 'Truffle Mushroom Pasta', description: 'Fettuccine with wild mushrooms, truffle oil, and parmesan cream', price: 18.99, image: '', category: 'Pasta', rating: 4.8, reviewCount: 134, isVeg: true, isPopular: true, isBestseller: true },
        quantity: 1,
        restaurantName: 'Pasta Paradise',
      }
    ],
    status: 'preparing',
    subtotal: 18.99,
    deliveryFee: 1.99,
    tax: 1.52,
    discount: 0.00,
    total: 22.50,
    deliveryAddress: { id: 'a1', label: 'Home', street: '128 Birchwood Dr', city: 'Metroville', state: 'NY', zipCode: '10001', isDefault: true },
    paymentMethod: 'Google Pay',
    createdAt: '2026-07-11T19:45:00Z',
    estimatedDelivery: '2026-07-11T20:15:00Z',
    deliveryPartner: { name: 'Sarah Connor', phone: '+1 (555) 098-7654', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop', vehicle: 'Scooter (Red)', rating: 4.8 },
    timeline: [
      { status: 'Order Placed', time: '07:45 PM', description: 'Your order was successfully placed.', completed: true },
      { status: 'Confirmed', time: '07:47 PM', description: 'Restaurant has accepted your order.', completed: true },
      { status: 'Preparing', time: '07:50 PM', description: 'Our chef is preparing your delicious meal.', completed: false },
      { status: 'Out for Delivery', time: '--', description: 'Rider is on the way to your location.', completed: false },
      { status: 'Delivered', time: '--', description: 'Order delivered. Enjoy your food!', completed: false },
    ]
  }
];

export const notificationsList: Notification[] = [
  { id: 'n1', title: '50% OFF Grab It Now!', message: 'Use code TASTY50 on restaurants around you. Valid for next 2 hours.', type: 'offer', read: false, createdAt: '2026-07-11T18:00:00Z' },
  { id: 'n2', title: 'Order Confirmed', message: 'Your order at Pasta Paradise has been accepted.', type: 'order', read: false, createdAt: '2026-07-11T19:47:00Z' },
  { id: 'n3', title: 'Refund Completed', message: 'Refund for cancelled order ord-7711 is processed to your bank account.', type: 'system', read: true, createdAt: '2026-07-10T11:00:00Z' },
];
