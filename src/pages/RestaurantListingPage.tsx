import React, { useState, useMemo } from 'react';
import { useRestaurantStore } from '../store/restaurantStore';
import { Search, SlidersHorizontal, Star, Clock, Heart, RefreshCw } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

export const RestaurantListingPage: React.FC = () => {
  const { restaurants } = useRestaurantStore();

  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'time' | 'name'>('rating');

  // Extract all unique cuisines
  const allCuisines = useMemo(() => {
    const list = new Set<string>();
    restaurants.forEach(r => r.cuisine.forEach(c => list.add(c)));
    return Array.from(list);
  }, [restaurants]);

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setSelectedCuisine(null);
    setMinRating(null);
    setMaxDeliveryTime(null);
    setSortBy('rating');
  };

  // Filter & Sort Restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()));
        
        const matchesCuisine = selectedCuisine ? r.cuisine.includes(selectedCuisine) : true;
        
        const matchesRating = minRating ? r.rating >= minRating : true;
        
        let matchesTime = true;
        if (maxDeliveryTime) {
          const match = r.deliveryTime.match(/(\d+)-(\d+)/);
          if (match) {
            const avgTime = (parseInt(match[1]) + parseInt(match[2])) / 2;
            matchesTime = avgTime <= maxDeliveryTime;
          }
        }

        return matchesSearch && matchesCuisine && matchesRating && matchesTime;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'fee') return a.deliveryFee - b.deliveryFee;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        
        // Sorting by time
        const timeA = parseInt(a.deliveryTime) || 30;
        const timeB = parseInt(b.deliveryTime) || 30;
        return timeA - timeB;
      });
  }, [restaurants, search, selectedCuisine, minRating, maxDeliveryTime, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">All Restaurants</h1>
        <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">Discover culinary delights from partners around your location</p>
      </div>

      {/* Toolbar Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 space-y-6 bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold flex items-center gap-1.5 text-sm uppercase tracking-wider text-slate-700 dark:text-slate-350">
              <SlidersHorizontal className="h-4.5 w-4.5" /> Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-orange-500 font-bold hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">Search</label>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resto name..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Cuisines selector */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Cuisines</label>
            <div className="flex flex-wrap gap-1.5">
              {allCuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)}
                  className={`
                    px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                    ${selectedCuisine === cuisine
                      ? 'bg-orange-500 border-transparent text-white shadow-sm'
                      : 'bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-350 text-slate-650 dark:text-slate-350'
                    }
                  `}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings filters */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Rating</label>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map((rating) => (
                <label key={rating} className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={minRating === rating}
                    onChange={() => setMinRating(minRating === rating ? null : rating)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="flex items-center gap-1">
                    {rating}+ <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> & above
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Delivery Time filters */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Max Delivery Time</label>
            <div className="space-y-2">
              <input
                type="range"
                min="15"
                max="45"
                step="5"
                value={maxDeliveryTime || 45}
                onChange={(e) => setMaxDeliveryTime(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>15 Min</span>
                <span className="text-orange-500 font-extrabold">{maxDeliveryTime ? `Under ${maxDeliveryTime} Min` : 'Any Time'}</span>
                <span>45 Min</span>
              </div>
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-transparent border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:border-orange-500 transition-colors"
            >
              <option value="rating">Highest Rated</option>
              <option value="fee">Lowest Delivery Fee</option>
              <option value="time">Fastest Delivery</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Restaurants Cards Grid list */}
        <div className="lg:col-span-9">
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((resto) => (
                <RestaurantCard key={resto.id} restaurant={resto} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center max-w-sm mx-auto space-y-4">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mx-auto border border-slate-200/50">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">No restaurants match</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Try loosening your filters, changing cuisine parameters, or resetting categories search.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="rounded-xl">
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
