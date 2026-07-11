import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="py-20 max-w-md mx-auto text-center space-y-8">
      {/* Dynamic Scale & Rotation Check Circle */}
      <motion.div
        initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.15 }}
        className="h-28 w-28 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="h-16 w-16 fill-emerald-500/10" />
      </motion.div>

      {/* Message Info */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order Placed!</h1>
        <p className="text-sm text-slate-450 dark:text-slate-500 font-semibold leading-relaxed">
          Your order has been sent to the kitchen. You can check its preparation status inside the live tracking view.
        </p>
        {id && (
          <div className="inline-block bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 px-4.5 py-2 rounded-2xl text-xs font-mono font-black text-slate-800 dark:text-slate-200 mt-2">
            Order Reference: {id}
          </div>
        )}
      </div>

      {/* Navigation Triggers */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {id && (
          <Link to={`/track-order/${id}`} className="flex-1">
            <Button variant="primary" className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/10">
              <Eye className="h-4.5 w-4.5" /> Track Live Status
            </Button>
          </Link>
        )}
        <Link to="/" className="flex-1">
          <Button variant="outline" className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-1.5">
            <ShoppingBag className="h-4.5 w-4.5" /> Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
