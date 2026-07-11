import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CreditCard, MapPin, Truck, ChevronRight, Check, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export const CheckoutPage: React.FC = () => {
  const { items, getTotals, clearCart } = useCartStore();
  const { user, addOrder } = useAuthStore();
  
  const hasSavedAddresses = user?.addresses && user.addresses.length > 0;
  
  const [addressMode, setAddressMode] = useState<'saved' | 'custom'>(hasSavedAddresses ? 'saved' : 'custom');
  const [selectedAddressId, setSelectedAddressId] = useState(user?.addresses.find(a => a.isDefault)?.id || user?.addresses[0]?.id || '');
  
  // Custom address fields
  const [customStreet, setCustomStreet] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customState, setCustomState] = useState('');
  const [customZip, setCustomZip] = useState('');
  const [customLabel, setCustomLabel] = useState('Home');

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'cod'>('card');
  const [isPlacing, setIsPlacing] = useState(false);
  
  const navigate = useNavigate();
  const totals = getTotals();

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error('Auth session missing!');
      return;
    }

    if (addressMode === 'saved' && !selectedAddressId) {
      toast.error('Please select a saved delivery address.');
      return;
    }

    if (addressMode === 'custom' && (!customStreet.trim() || !customCity.trim() || !customState.trim() || !customZip.trim())) {
      toast.error('Please fill out all address fields.');
      return;
    }

    setIsPlacing(true);

    // Mock processing timeout
    setTimeout(() => {
      let deliveryAddress;
      if (addressMode === 'saved') {
        deliveryAddress = user.addresses.find(a => a.id === selectedAddressId) || user.addresses[0];
      } else {
        deliveryAddress = {
          id: `custom-${Date.now()}`,
          label: customLabel.trim() || 'Custom',
          street: customStreet.trim(),
          city: customCity.trim(),
          state: customState.trim(),
          zipCode: customZip.trim(),
          isDefault: false,
        };
      }

      const newOrderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        id: newOrderId,
        userId: user.id,
        items,
        restaurant: {
          id: items[0].food.restaurantId,
          name: items[0].restaurantName,
          image: items[0].food.image,
        },
        status: 'placed' as const,
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        tax: totals.tax,
        discount: totals.discount,
        total: totals.total,
        deliveryAddress,
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'gpay' ? 'Google Pay' : 'Cash on Delivery',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
        deliveryPartner: {
          name: 'Marcus Swift',
          phone: '+1 (555) 998-1123',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
          vehicle: 'Motorcycle (Silver)',
          rating: 4.9,
        },
        timeline: [
          { status: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), description: 'Your order was successfully placed.', completed: true },
          { status: 'Confirmed', time: '--', description: 'Restaurant has accepted your order.', completed: false },
          { status: 'Preparing', time: '--', description: 'Our chef is preparing your delicious meal.', completed: false },
          { status: 'Out for Delivery', time: '--', description: 'Rider is on the way to your location.', completed: false },
          { status: 'Delivered', time: '--', description: 'Order delivered. Enjoy your food!', completed: false },
        ]
      };

      addOrder(newOrder);
      clearCart();
      setIsPlacing(false);
      toast.success('Order placed successfully!');
      navigate(`/order-success/${newOrderId}`);
    }, 1800);
  };

  const paymentOptions = [
    { id: 'card', label: 'Credit / Debit Card', desc: 'Pay securely using Card', icon: CreditCard },
    { id: 'gpay', label: 'Google Pay / Digital Wallet', desc: 'Instant checkout via wallet', icon: ChevronRight },
    { id: 'cod', label: 'Cash On Delivery', desc: 'Pay when rider arrives', icon: Truck },
  ] as const;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Checkout</h1>
        <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">Provide your details and complete the order placement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Addresses & Payments details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Address select block */}
          <Card className="p-6 space-y-5 hover:shadow-none bg-white dark:bg-slate-900/40">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="h-4.5 w-4.5 text-orange-500" /> Delivery Address
            </h3>

            {/* Selection tabs for address mode */}
            {hasSavedAddresses && (
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAddressMode('saved')}
                  className={`flex-1 py-2 text-center rounded-lg cursor-pointer transition-all ${
                    addressMode === 'saved'
                      ? 'bg-white dark:bg-slate-905 text-slate-950 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Saved Addresses
                </button>
                <button
                  type="button"
                  onClick={() => setAddressMode('custom')}
                  className={`flex-1 py-2 text-center rounded-lg cursor-pointer transition-all ${
                    addressMode === 'custom'
                      ? 'bg-white dark:bg-slate-905 text-slate-955 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Type New Address
                </button>
              </div>
            )}

            {/* Render saved address list */}
            {addressMode === 'saved' && hasSavedAddresses ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center
                      ${selectedAddressId === addr.id
                        ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                        : 'border-slate-150 dark:border-slate-800 hover:border-slate-200'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 dark:text-slate-50 text-sm">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-805 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                      </p>
                    </div>
                    {selectedAddressId === addr.id && (
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Render inline input fields to type address directly */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Address Label"
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="Home, Office, Friend..."
                  />
                  <Input
                    label="Zip Code"
                    type="text"
                    required
                    value={customZip}
                    onChange={(e) => setCustomZip(e.target.value)}
                    placeholder="10001"
                  />
                </div>
                
                <Input
                  label="Street Address"
                  type="text"
                  required
                  value={customStreet}
                  onChange={(e) => setCustomStreet(e.target.value)}
                  placeholder="128 Birchwood Dr, Apt 4B"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    type="text"
                    required
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Metroville"
                  />
                  <Input
                    label="State"
                    type="text"
                    required
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Payments UI Select block */}
          <Card className="p-6 space-y-4 hover:shadow-none">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-355 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <CreditCard className="h-4.5 w-4.5 text-orange-500" /> Payment Method
            </h3>

            <div className="space-y-3">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const active = paymentMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`
                      p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4
                      ${active
                        ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10'
                        : 'border-slate-150 dark:border-slate-800 hover:border-slate-205'
                      }
                    `}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">{opt.label}</h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                    {active && (
                      <div className="h-5 w-5 bg-orange-500 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Order review sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-6 hover:shadow-none">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-850 pb-3">
              Order Review
            </h3>

            {/* List mini items */}
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.food.id} className="flex justify-between items-center text-xs gap-3">
                  <span className="text-slate-650 dark:text-slate-400 line-clamp-1">
                    <span className="font-bold text-slate-950 dark:text-white mr-1.5">{item.quantity}x</span>
                    {item.food.name}
                  </span>
                  <span className="font-semibold text-slate-950 dark:text-white">${(item.food.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-xs border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Delivery Fee</span>
                <span>{totals.deliveryFee === 0 ? 'Free' : `$${totals.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Taxes</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-semibold">
                  <span>Discount</span>
                  <span>-${totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-slate-950 dark:text-white text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handlePlaceOrder}
              isLoading={isPlacing}
              className="w-full rounded-xl py-3.5 font-bold shadow-lg shadow-orange-500/20"
            >
              Place Order (${totals.total.toFixed(2)})
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
