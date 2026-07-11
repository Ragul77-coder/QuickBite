import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useRestaurantStore } from '../store/restaurantStore';
import { useCartStore } from '../store/cartStore';
import { User, MapPin, ShoppingBag, Heart, Settings, Plus, Trash2, ArrowRight, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, orders, wishlist, updateProfile, addAddress, deleteAddress, toggleFavoriteFood, toggleFavoriteRestaurant } = useAuthStore();
  const { restaurants, foods } = useRestaurantStore();
  const { addToCart } = useCartStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'info';

  // Profile Edit fields
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  // Address Form fields
  const [addressLabel, setAddressLabel] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [addressDefault, setAddressDefault] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Sync inputs if user changes/loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone);
      setProfileEmail(user.email);
    }
  }, [user]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileName, profilePhone, profileEmail);
    toast.success('Profile details updated!');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLabel.trim() || !addressStreet.trim() || !addressCity.trim() || !addressState.trim() || !addressZip.trim()) {
      toast.error('All address fields are required.');
      return;
    }

    addAddress({
      label: addressLabel,
      street: addressStreet,
      city: addressCity,
      state: addressState,
      zipCode: addressZip,
      isDefault: addressDefault,
    });

    toast.success('Address saved successfully!');
    
    // Clear inputs
    setAddressLabel('');
    setAddressStreet('');
    setAddressCity('');
    setAddressState('');
    setAddressZip('');
    setAddressDefault(false);
    setShowAddressForm(false);
  };

  const handleReorder = (orderItems: typeof orders[0]['items']) => {
    // Add first item to cart
    if (orderItems.length === 0) return;
    
    let addedAny = false;
    orderItems.forEach(item => {
      const res = addToCart(item.food, item.restaurantName, item.quantity);
      if (res.success) addedAny = true;
    });

    if (addedAny) {
      toast.success('Items added to cart! Proceed to checkout.');
      navigate('/cart');
    } else {
      toast.error('Could not reorder. Cart contains items from another restaurant.');
    }
  };

  // Get wishlist details
  const favoriteRestaurants = restaurants.filter(r => wishlist.restaurantIds.includes(r.id));
  const favoriteFoods = foods.filter(f => wishlist.foodIds.includes(f.id));

  const tabOptions = [
    { id: 'info', label: 'Profile Info', icon: User },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'orders', label: 'Past Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const setTab = (id: typeof tabOptions[number]['id']) => {
    setSearchParams({ tab: id });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      case 'placed': case 'confirmed': return 'info';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header banner */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">Manage addresses, profile details, and track order histories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1.5">
          {tabOptions.map((opt) => {
            const Icon = opt.icon;
            const active = currentTab === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTab(opt.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left
                  ${active
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10 font-bold'
                    : 'text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Panels */}
        <div className="lg:col-span-9">
          
          {/* PANEL 1: Profile Info Form */}
          {currentTab === 'info' && (
            <Card className="p-6 space-y-6 bg-white dark:bg-slate-900/40">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-350 border-b border-slate-100 dark:border-slate-800 pb-3">Personal Details</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <Input
                  label="Display Name"
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  type="text"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                />
                <Button type="submit" variant="primary" className="rounded-xl px-5 py-2.5 font-bold">
                  Save Details
                </Button>
              </form>
            </Card>
          )}

          {/* PANEL 2: Saved Addresses */}
          {currentTab === 'addresses' && (
            <Card className="p-6 space-y-6 bg-white dark:bg-slate-900/40">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350">Delivery Addresses</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="rounded-xl flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Address
                </Button>
              </div>

              {/* Address Addition Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Label (e.g. Home)" type="text" required value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} placeholder="Home" />
                    <Input label="Zip Code" type="text" required value={addressZip} onChange={(e) => setAddressZip(e.target.value)} placeholder="10001" />
                  </div>
                  <Input label="Street Address" type="text" required value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} placeholder="128 Birchwood Dr" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" type="text" required value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder="Metroville" />
                    <Input label="State" type="text" required value={addressState} onChange={(e) => setAddressState(e.target.value)} placeholder="NY" />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350">
                    <input type="checkbox" checked={addressDefault} onChange={() => setAddressDefault(!addressDefault)} className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
                    <span>Set as Default Delivery Address</span>
                  </label>
                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" className="rounded-xl px-4 py-2">Save Address</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="rounded-xl px-4 py-2">Cancel</Button>
                  </div>
                </form>
              )}

              {/* List saved addresses */}
              <div className="space-y-4 max-w-2xl">
                {user?.addresses.length ? (
                  user.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-2xl border border-slate-150 dark:border-slate-850 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{addr.label}</span>
                          {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          deleteAddress(addr.id);
                          toast.success('Address deleted.');
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-semibold italic">No addresses saved. Add one to complete checkout faster.</p>
                )}
              </div>
            </Card>
          )}

          {/* PANEL 3: Past Orders */}
          {currentTab === 'orders' && (
            <Card className="p-6 space-y-6 bg-white dark:bg-slate-900/40">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-355 border-b border-slate-100 dark:border-slate-800 pb-3">Order History</h3>
              
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="border border-slate-150 dark:border-slate-850/80 rounded-2xl overflow-hidden">
                      {/* Order info header */}
                      <div className="bg-slate-50/80 dark:bg-slate-900/40 p-4 border-b border-slate-150 dark:border-slate-850 flex flex-wrap gap-4 items-center justify-between text-xs font-semibold text-slate-500">
                        <div className="flex gap-4">
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase">Placed On</span>
                            <span className="text-slate-850 dark:text-slate-300 font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase">Total Amount</span>
                            <span className="text-slate-900 dark:text-white font-black">${order.total.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase">Reference ID</span>
                            <span className="text-slate-850 dark:text-slate-200 font-mono font-bold">{order.id}</span>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(order.status)} className="capitalize py-0.5 px-2.5">
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      {/* Content details */}
                      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-4 items-center">
                          <img src={order.restaurant.image} alt={order.restaurant.name} className="h-14 w-14 rounded-xl object-cover shrink-0 bg-slate-100" />
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm">{order.restaurant.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {order.items.map(i => `${i.quantity}x ${i.food.name}`).join(', ')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <Link to={`/track-order/${order.id}`} className="flex-1 sm:flex-none">
                              <Button variant="primary" size="sm" className="w-full rounded-xl">
                                Track Order
                              </Button>
                            </Link>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleReorder(order.items)} className="flex-1 sm:flex-none rounded-xl">
                            Reorder Items
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-semibold italic">You haven't ordered anything yet!</p>
                )}
              </div>
            </Card>
          )}

          {/* PANEL 4: Saved Favorites */}
          {currentTab === 'wishlist' && (
            <div className="space-y-8">
              {/* Restaurants Favorites */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  Saved Restaurants ({favoriteRestaurants.length})
                </h3>
                {favoriteRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRestaurants.map(r => (
                      <div key={r.id} className="relative">
                        <Card className="h-full flex flex-col">
                          <img src={r.image} alt={r.name} className="h-32 object-cover" />
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-slate-950 dark:text-white text-sm truncate">{r.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{r.cuisine.join(', ')}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/80">
                              <Link to={`/restaurant/${r.id}`}>
                                <Button variant="primary" size="sm" className="rounded-lg text-xs py-1 px-2.5">View</Button>
                              </Link>
                              <button onClick={() => toggleFavoriteRestaurant(r.id)} className="text-red-500 text-xs font-bold hover:underline cursor-pointer">
                                Remove
                              </button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold italic">No saved restaurants found.</p>
                )}
              </div>

              {/* Foods Favorites */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  Saved Dishes ({favoriteFoods.length})
                </h3>
                {favoriteFoods.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteFoods.map(f => {
                      const parentResto = restaurants.find(r => r.id === f.restaurantId);
                      return (
                        <Card key={f.id} className="h-full flex flex-col">
                          <img src={f.image} alt={f.name} className="h-32 object-cover" />
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-slate-950 dark:text-white text-sm truncate">{f.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{parentResto?.name || 'QuickBite Partner'}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/80">
                              <span className="text-xs font-black text-slate-900 dark:text-white">${f.price}</span>
                              <div className="flex gap-2">
                                <button onClick={() => toggleFavoriteFood(f.id)} className="text-red-500 text-xs font-bold hover:underline cursor-pointer">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold italic">No saved foods found.</p>
                )}
              </div>
            </div>
          )}

          {/* PANEL 5: Settings */}
          {currentTab === 'settings' && (
            <Card className="p-6 space-y-6 bg-white dark:bg-slate-900/40">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-355 border-b border-slate-100 dark:border-slate-800 pb-3">Notification Preferences</h3>
              
              <div className="space-y-4 max-w-md">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">Email Alerts</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Receive copy invoices and billing details via email.</span>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">SMS Updates</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Get real-time SMS tracking updates on your phone.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">Marketing Emails</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Get notifications on new restaurant additions and coupons.</span>
                  </div>
                </label>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};
