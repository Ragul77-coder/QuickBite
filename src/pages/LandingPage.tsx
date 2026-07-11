import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Clock, Award, ShieldCheck, ThumbsUp } from 'lucide-react';
import { useRestaurantStore } from '../store/restaurantStore';
import { categories } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { FoodCard } from '../components/food/FoodCard';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { restaurants, foods } = useRestaurantStore();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  // Get top featured restaurants
  const featuredRestaurants = restaurants.filter(r => r.isFeatured).slice(0, 3);
  
  // Get popular foods
  const popularFoods = foods.filter(f => f.isPopular).slice(0, 4);

  const stats = [
    { label: 'Restaurants', value: '150+' },
    { label: 'Happy Customers', value: '10K+' },
    { label: 'Deliveries Made', value: '50K+' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-orange-600 to-amber-500 text-white p-8 md:p-16 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-orange-100">
              Hungry? We got you covered
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Delicious Food <br />
              Delivered to Your <span className="underline decoration-amber-300 decoration-wavy">Doorstep</span>
            </h1>
            <p className="text-orange-55 text-sm md:text-base max-w-lg leading-relaxed">
              Order from your favorite local restaurants, track your delivery in real-time, and enjoy fresh hot meals whenever you want.
            </p>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl shadow-xl max-w-xl text-slate-850">
              <div className="flex-1 flex items-center gap-2.5 px-3">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cuisine, restaurants, or dishes..."
                  className="w-full bg-transparent border-none text-sm outline-none placeholder-slate-400 text-slate-900 focus:ring-0"
                />
              </div>
              <Button type="submit" variant="primary" className="rounded-xl px-6 py-3 font-semibold text-sm">
                Find Food
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-md">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-xl md:text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-orange-100/80 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Banner Graphic Placeholder with Mock Image */}
          <div className="lg:col-span-5 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square max-w-[380px] mx-auto rounded-full border-8 border-white/10 overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop"
                alt="Delicious meals"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Offers Banner Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white flex justify-between items-center relative overflow-hidden shadow-lg group">
          <div className="space-y-2.5 z-10">
            <span className="bg-white/20 text-xs px-2.5 py-1 rounded-md font-bold uppercase">Limited Offer</span>
            <h3 className="text-xl font-bold">Get 50% OFF</h3>
            <p className="text-xs text-red-50 text-slate-200">On your first burger order of the week</p>
            <Link to="/restaurants">
              <Button variant="glass" size="sm" className="mt-2 text-white border-white/30">
                Order Burgers <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="h-28 w-28 rounded-full border-4 border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" alt="Burger promo" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white flex justify-between items-center relative overflow-hidden shadow-lg group">
          <div className="space-y-2.5 z-10">
            <span className="bg-white/20 text-xs px-2.5 py-1 rounded-md font-bold uppercase">Healthy Choice</span>
            <h3 className="text-xl font-bold">Free Delivery</h3>
            <p className="text-xs text-slate-250 text-slate-200">On all fresh organic salad orders</p>
            <Link to="/restaurants">
              <Button variant="glass" size="sm" className="mt-2 text-white border-white/30">
                Go Green <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="h-28 w-28 rounded-full border-4 border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
            <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop" alt="Salad promo" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* 3. Categories List Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Explore Categories</h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Satisy your cravings with our curated filters</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className="group"
            >
              <Card className="p-4 flex flex-col items-center gap-3 text-center border-slate-100 hover:border-orange-500/20 hover:bg-orange-500/5 transition-all">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-108 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-500 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{cat.count} Options</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Restaurants Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Featured Restaurants</h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">The top-rated places in your town</p>
          </div>
          <Link to="/restaurants" className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600">
            See All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRestaurants.map((resto) => (
            <RestaurantCard key={resto.id} restaurant={resto} />
          ))}
        </div>
      </section>

      {/* 5. Popular Dishes Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Popular Dishes</h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">Our customers most loved food items</p>
          </div>
          <Link to="/search" className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600">
            See All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularFoods.map((food) => {
            const parentRestoName = restaurants.find(r => r.id === food.restaurantId)?.name || 'QuickBite Partner';
            return (
              <FoodCard key={food.id} food={food} restaurantName={parentRestoName} />
            );
          })}
        </div>
      </section>

      {/* 6. Why QuickBite Section */}
      <section className="bg-white dark:bg-slate-900/30 rounded-3xl p-8 md:p-12 border border-slate-100 dark:border-slate-900/60 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="space-y-3.5">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto md:mx-0">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">Best Quality Foods</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
            We partner only with hygiene certified and highly rated local kitchens to guarantee taste and freshness.
          </p>
        </div>

        <div className="space-y-3.5">
          <div className="h-12 w-12 rounded-2xl bg-orange-50/10 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto md:mx-0">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">Under 30 Min Delivery</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
            Our super optimized rider algorithms ensure food reaches you hot and steaming straight from the chef.
          </p>
        </div>

        <div className="space-y-3.5">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto md:mx-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">Secure Checkout & Care</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-semibold">
            Enjoy instant digital checkout with fake local payment modes and responsive support team for order help.
          </p>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="space-y-8">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-slate-50">What Customers Say</h2>
          <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold">Read verified feedback from daily foodies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 italic leading-relaxed">
              "Ordering food has never been this simple. QuickBite gets me my Sushi in under 35 minutes every Friday. Recommended!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Alice" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-slate-50">Alice Smith</h4>
                <p className="text-[10px] text-slate-450 font-semibold">Loyal Customer</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 italic leading-relaxed">
              "The interface is so premium and fluid. The light/dark mode switch looks clean. Placing order was a breeze."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="David" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-slate-50">David Miller</h4>
                <p className="text-[10px] text-slate-450 font-semibold">Weekly Foodie</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 italic leading-relaxed">
              "Truffle Pasta from Pasta Paradise was hot and tasted just like it does dine-in. Reusable components work great!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="Emily" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-950 dark:text-slate-50">Emily Watson</h4>
                <p className="text-[10px] text-slate-450 font-semibold">Pasta Lover</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

    </div>
  );
};
