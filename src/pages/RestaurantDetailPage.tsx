import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurantStore } from '../store/restaurantStore';
import { Star, Clock, Info, Heart, ArrowLeft, ShieldCheck, MessageSquare, Utensils } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { reviews as mockReviews } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FoodCard } from '../components/food/FoodCard';
import { Badge } from '../components/ui/Badge';
import toast from 'react-hot-toast';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { restaurants, foods } = useRestaurantStore();
  const { wishlist, toggleFavoriteRestaurant, isAuthenticated } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');

  // Find Restaurant
  const restaurant = useMemo(() => {
    return restaurants.find(r => r.id === id);
  }, [restaurants, id]);

  // Find Foods belonging to this Restaurant
  const restaurantFoods = useMemo(() => {
    return foods.filter(f => f.restaurantId === id);
  }, [foods, id]);

  // Extract menu categories
  const menuCategories = useMemo(() => {
    const list = new Set<string>();
    restaurantFoods.forEach(f => list.add(f.category));
    return ['All', ...Array.from(list)];
  }, [restaurantFoods]);

  // Filter foods by Category
  const filteredFoods = useMemo(() => {
    if (selectedCategory === 'All') return restaurantFoods;
    return restaurantFoods.filter(f => f.category === selectedCategory);
  }, [restaurantFoods, selectedCategory]);

  // Get matching reviews
  const restaurantReviews = useMemo(() => {
    return mockReviews.filter(rev => rev.restaurantId === id);
  }, [id]);

  if (!restaurant) {
    return (
      <div className="py-24 text-center max-w-sm mx-auto space-y-4">
        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto">
          <Info className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">Restaurant Not Found</h3>
        <p className="text-xs text-slate-400 leading-relaxed font-semibold">
          The restaurant you are trying to view does not exist or has been removed from our database.
        </p>
        <Link to="/restaurants">
          <Button variant="primary" size="sm" className="rounded-xl">
            View All Restaurants
          </Button>
        </Link>
      </div>
    );
  }

  const isFavorite = wishlist.restaurantIds.includes(restaurant.id);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites!');
      return;
    }
    toggleFavoriteRestaurant(restaurant.id);
    if (isFavorite) {
      toast.success(`${restaurant.name} removed from favorites.`);
    } else {
      toast.success(`${restaurant.name} added to favorites!`);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Navigation Back */}
      <div className="flex items-center justify-between">
        <Link to="/restaurants" className="flex items-center gap-1.5 text-xs font-bold text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Restaurants
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavoriteClick}
          className="rounded-xl flex items-center gap-1 text-slate-700 dark:text-slate-350"
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          {isFavorite ? 'Saved' : 'Save'}
        </Button>
      </div>

      {/* 2. Restaurant Banner Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
        {/* Cover Graphic */}
        <div className="relative h-60 md:h-80 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        {/* Restaurant Info Panel */}
        <div className="p-6 md:p-8 relative -mt-20 z-10 text-white flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
          <div className="space-y-3.5">
            {/* Cuisines list */}
            <div className="flex flex-wrap gap-1.5">
              {restaurant.cuisine.map((c) => (
                <span key={c} className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  {c}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black leading-tight text-white">
              {restaurant.name}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-xl">
              {restaurant.description}
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-350">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-white font-extrabold">{restaurant.rating}</span> ({restaurant.reviewCount} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {restaurant.deliveryTime}
              </span>
              <span>•</span>
              <span>Min. Order ${restaurant.minOrder}</span>
            </div>
          </div>

          {/* Delivery fee badges */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[120px] self-start md:self-auto">
            <span className="text-[10px] uppercase font-bold text-slate-350 tracking-wider">Delivery Fee</span>
            <span className="text-2xl font-black text-white mt-1">
              {restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee}`}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Navigation Menu vs Reviews Tabs */}
      <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-1.5 pb-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer ${
            activeTab === 'menu'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
          }`}
        >
          <Utensils className="h-4 w-4" /> Menu Items ({restaurantFoods.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 pb-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-orange-500 text-orange-500'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'
          }`}
        >
          <MessageSquare className="h-4 w-4" /> Reviews ({restaurantReviews.length})
        </button>
      </div>

      {/* 4. Active Tab Content Panel */}
      {activeTab === 'menu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Menu Categories Pills */}
          <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-20 z-10">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-450 dark:text-slate-550 mb-3 px-1">Menu Categories</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-none">
              {menuCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-4 py-2.5 text-xs font-bold rounded-xl text-left shrink-0 transition-colors cursor-pointer w-auto lg:w-full
                    ${selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                      : 'bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Foods list grid */}
          <div className="lg:col-span-9">
            {filteredFoods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFoods.map((food) => (
                  <FoodCard key={food.id} food={food} restaurantName={restaurant.name} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center max-w-sm mx-auto space-y-4">
                <div className="h-14 w-14 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                  <Utensils className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-slate-50">No items found</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold leading-relaxed">
                  No food items matching this category list are currently available.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Reviews Section list */
        <div className="max-w-3xl space-y-6">
          {restaurantReviews.length > 0 ? (
            restaurantReviews.map((rev) => (
              <Card key={rev.id} className="p-6 space-y-3.5 hover:shadow-none">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <img src={rev.userAvatar} alt={rev.userName} className="h-10 w-10 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50">{rev.userName}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg border border-amber-250/20">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </Card>
            ))
          ) : (
            <div className="py-20 text-center max-w-sm mx-auto space-y-4">
              <div className="h-14 w-14 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-slate-950 dark:text-slate-50">No reviews yet</h4>
              <p className="text-xs text-slate-450 dark:text-slate-500 font-semibold leading-relaxed">
                Be the first to order and leave a review for {restaurant.name}!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
