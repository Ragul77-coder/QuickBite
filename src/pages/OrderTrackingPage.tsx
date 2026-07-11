import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Clock, Phone, MapPin, CheckCircle, Navigation, ArrowLeft, Loader2, Sparkles, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus } = useAuthStore();
  const [tick, setTick] = useState(0);

  // Find order matching ID
  const order = useMemo(() => {
    return orders.find(o => o.id === id);
  }, [orders, id]);

  // Simulate progress triggers
  useEffect(() => {
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 15000); // Progress every 15 seconds

    return () => clearInterval(timer);
  }, [order]);

  // Trigger next step progression based on mock ticks
  useEffect(() => {
    if (!order) return;
    if (order.status === 'placed') {
      updateOrderStatus(order.id, 'confirmed');
      toast.success('Order accepted by kitchen!');
    } else if (order.status === 'confirmed' && tick > 0) {
      updateOrderStatus(order.id, 'preparing');
      toast.success('Chef has started preparing your order.');
    } else if (order.status === 'preparing' && tick > 1) {
      updateOrderStatus(order.id, 'out_for_delivery');
      toast.success('Rider picked up your order! On the way.');
    } else if (order.status === 'out_for_delivery' && tick > 2) {
      updateOrderStatus(order.id, 'delivered');
      toast.success('Order delivered. Enjoy your meal!');
    }
  }, [tick, order?.status]);

  if (!order) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto space-y-4">
        <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">Order Not Found</h3>
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          The order reference you are trying to track does not exist.
        </p>
        <Link to="/profile?tab=orders">
          <Button variant="primary" size="sm" className="rounded-xl">
            My Orders List
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header back navigation link */}
      <div className="flex items-center justify-between">
        <Link to="/profile?tab=orders" className="flex items-center gap-1.5 text-xs font-bold text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>
        <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} className="capitalize py-0.5 px-3">
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tracking Timeline Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-6 hover:shadow-none bg-white dark:bg-slate-900/40">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350">Delivery Timeline</h3>
              
              {/* Spinner if active */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <span className="flex items-center gap-1 text-[10px] text-orange-500 font-bold uppercase tracking-wider animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" /> Live Updates
                </span>
              )}
            </div>

            {/* Timeline component stack */}
            <div className="relative border-l border-slate-205 dark:border-slate-800 ml-3.5 pl-6 space-y-8">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point indicator */}
                  <span className={`
                    absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 bg-white dark:bg-slate-950 flex items-center justify-center
                    ${step.completed
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500'
                      : 'border-slate-205 dark:border-slate-800 text-slate-300'
                    }
                  `}>
                    {step.completed && <CheckCircle className="h-2.5 w-2.5 fill-current" />}
                  </span>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className={`font-bold ${step.completed ? 'text-slate-950 dark:text-white' : 'text-slate-400'}`}>
                        {step.status}
                      </h4>
                      <span className="text-slate-400 font-medium">{step.time}</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${step.completed ? 'text-slate-500 dark:text-slate-450' : 'text-slate-400/80'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Delivery partner info & addresses column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Delivery partner card detail */}
          {order.deliveryPartner && (
            <Card className="p-6 space-y-4 hover:shadow-none">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-450 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850 pb-2.5">
                Delivery Partner
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={order.deliveryPartner.avatar}
                  alt={order.deliveryPartner.name}
                  className="h-12 w-12 rounded-2xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-950 dark:text-slate-50 text-sm truncate">{order.deliveryPartner.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{order.deliveryPartner.vehicle}</p>
                </div>
                <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg border border-amber-250/25">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{order.deliveryPartner.rating}</span>
                </div>
              </div>
              <a href={`tel:${order.deliveryPartner.phone}`}>
                <Button variant="outline" size="sm" className="w-full rounded-xl gap-1.5 mt-2 text-xs">
                  <Phone className="h-3.5 w-3.5" /> Call Rider
                </Button>
              </a>
            </Card>
          )}

          {/* Delivery location address */}
          <Card className="p-6 space-y-3.5 hover:shadow-none text-xs">
            <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-450 dark:text-slate-500 border-b border-slate-100 dark:border-slate-850 pb-2.5">
              Delivery Address
            </h3>
            <div className="flex gap-2 text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
              <MapPin className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-950 dark:text-white mb-0.5">{order.deliveryAddress.label}</span>
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
