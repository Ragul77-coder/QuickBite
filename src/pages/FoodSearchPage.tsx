import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRestaurantStore } from '../store/restaurantStore';
import { Search, Filter, Compass, Info, Heart } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FoodCard } from '../components/food/FoodCard';
import { Card } from '../components/ui/Card';

export const FoodSearchPage: React.FC = () => {
  const { foods, restaurants } = useRestaurantStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse Query Parameters
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialQuery = queryParams.get('q') || '';
  const initialCategory = queryParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    setSearchQuery(queryParams.get('q') || '');
    setSelectedCategory(queryParams.get('category') || '');
  }, [queryParams]);

  const popularSuggestions = ['Burger', 'Sushi', 'Pasta', 'Biryani', 'Pizza', 'Salad'];

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    setSelectedCategory('');
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory('');
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Filter foods globally
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      // 1. Search Query match
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = query
        ? food.name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query) ||
          food.category.toLowerCase().includes(query)
        : true;

      // 2. Category tag match
      const matchesCategory = selectedCategory
        ? food.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;

      // 3. Veg / Non Veg
      const matchesVeg = vegOnly ? food.isVeg : true;

      // 4. Min Rating
      const matchesRating = minRating ? food.rating >= minRating : true;

      return matchesQuery && matchesCategory && matchesVeg && matchesRating;
    });
  }, [foods, searchQuery, selectedCategory, vegOnly, minRating]);

  // Extract unique categories for selection filters
  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    foods.forEach(f => list.add(f.category));
    return Array.from(list);
  }, [foods]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setVegOnly(false);
    setMinRating(null);
    navigate('/search');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Global Search</h1>
        <p className="text-xs text-slate-450 dark:text-slate-500 mt-1 font-semibold">Search for any dish, drink, or dessert across all restaurant partners</p>
      </div>

      {/* 2. Search Input bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 bg-white dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm max-w-2xl">
        <div className="flex-1 flex items-center gap-2.5 px-3">
          <Search className="h-5 w-5 text-slate-450 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type foods, cravings, cuisines..."
            className="w-full bg-transparent border-none text-sm outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-0"
          />
        </div>
        <Button type="submit" variant="primary" className="rounded-xl px-5">
          Search
        </Button>
      </form>

      {/* Suggestions pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Popular:</span>
        {popularSuggestions.map((term) => (
          <button
            key={term}
            onClick={() => handleSuggestionClick(term)}
            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-orange-500/10 hover:text-orange-500 font-semibold transition-colors cursor-pointer text-slate-650 dark:text-slate-350"
          >
            {term}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 3. Filter controls sidebar */}
        <div className="lg:col-span-3 space-y-6 bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-700 dark:text-slate-355">
              <Filter className="h-4 w-4" /> Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-xs text-orange-500 font-bold hover:text-orange-655 cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Categories select */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                  className={`
                    px-2.5 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer
                    ${selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-orange-500 border-transparent text-white shadow-sm'
                      : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Veg Toggle checkbox */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Dietary</label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={() => setVegOnly(!vegOnly)}
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span>Vegetarian Only</span>
            </label>
          </div>

          {/* Rating filter checkbox */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 block">Rating</label>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map((rate) => (
                <label key={rate} className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350">
                  <input
                    type="checkbox"
                    checked={minRating === rate}
                    onChange={() => setMinRating(minRating === rate ? null : rate)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span>{rate}+ Stars</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Food cards grid results */}
        <div className="lg:col-span-9">
          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food) => {
                const parentRestoName = restaurants.find(r => r.id === food.restaurantId)?.name || 'QuickBite Partner';
                return (
                  <FoodCard key={food.id} food={food} restaurantName={parentRestoName} />
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center max-w-sm mx-auto space-y-4">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-900/60 rounded-full flex items-center justify-center text-slate-450 mx-auto border border-slate-200/50">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">No dishes match</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                We couldn't find any dishes matching your query. Try searching for different items or clearing active filters.
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl">
                Reset Search Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
