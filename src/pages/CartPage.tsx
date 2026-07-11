import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Ticket, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const { items, coupon, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  const totals = getTotals();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode);
    if (res.success) {
      toast.success(res.message);
      setCouponCode('');
    } else {
      toast.error(res.message);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login/signup to place an order.');
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto space-y-5">
        <div className="h-20 w-20 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mx-auto animate-pulse">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-slate-950 dark:text-slate-50">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Browse our list of premium local partners and add delicious dishes to satisfy your hunger!
          </p>
        </div>
        <Link to="/restaurants">
          <Button variant="primary" className="rounded-xl px-6">
            Browse Restaurants
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">Review your ordered items from {items[0].restaurantName}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearCart();
            toast.success('Cart cleared successfully.');
          }}
          className="rounded-xl text-red-500 border-red-500/20 hover:bg-red-50/50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4.5 w-4.5 mr-1" /> Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card key={item.food.id} className="p-4 flex gap-4 items-center">
              <img
                src={item.food.image}
                alt={item.food.name}
                className="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-bold text-slate-950 dark:text-slate-50 text-sm line-clamp-1">
                      {item.food.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.food.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.food.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    ${(item.food.price * item.quantity).toFixed(2)}
                  </span>
                  
                  {/* Quantity adjustment controls */}
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.food.id, item.quantity - 1)}
                      className="p-1 hover:bg-white dark:hover:bg-slate-900 rounded-md transition-colors cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.food.id, item.quantity + 1)}
                      className="p-1 hover:bg-white dark:hover:bg-slate-900 rounded-md transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Totals & checkout summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-6 bg-white dark:bg-slate-900/40">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350 border-b border-slate-100 dark:border-slate-850 pb-3">
              Order Summary
            </h3>

            {/* Price lines */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {totals.deliveryFee === 0 ? 'Free' : `$${totals.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST / Tax (8%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">${totals.tax.toFixed(2)}</span>
              </div>

              {/* Promo discounts applied */}
              {coupon && (
                <div className="flex justify-between text-emerald-500 font-semibold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-xs">
                  <span>Discount ({coupon.code})</span>
                  <div className="flex items-center gap-1">
                    <span>-${totals.discount.toFixed(2)}</span>
                    <button onClick={removeCoupon} className="hover:text-red-500 transition-colors cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between font-black text-slate-950 dark:text-white text-base pt-3 border-t border-slate-105 dark:border-slate-800">
                <span>Total Amount</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupons form */}
            {!coupon && (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="WELCOME20"
                  className="py-2.5"
                  leftIcon={<Ticket className="h-4 w-4" />}
                />
                <Button type="submit" variant="outline" className="rounded-xl px-4 text-xs font-bold uppercase shrink-0">
                  Apply
                </Button>
              </form>
            )}

            {/* Action buttons */}
            <Button
              variant="primary"
              onClick={handleCheckout}
              className="w-full rounded-xl py-3.5 font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20"
            >
              Checkout Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
