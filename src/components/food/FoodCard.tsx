import React from 'react';
import { Heart, Plus, Minus, Star, CircleDot } from 'lucide-react';
import { FoodItem } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface FoodCardProps {
  food: FoodItem;
  restaurantName?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, restaurantName = 'QuickBite Partner' }) => {
  const { wishlist, toggleFavoriteFood, isAuthenticated } = useAuthStore();
  const { items, addToCart, updateQuantity } = useCartStore();

  const isFavorite = wishlist.foodIds.includes(food.id);
  const cartItem = items.find(item => item.food.id === food.id);
  const quantity = cartItem?.quantity || 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save favorites!');
      return;
    }

    toggleFavoriteFood(food.id);
    if (isFavorite) {
      toast.success(`${food.name} removed from favorites.`);
    } else {
      toast.success(`${food.name} added to favorites!`);
    }
  };

  const handleAddToCart = () => {
    const res = addToCart(food, restaurantName);
    if (res.success) {
      toast.success(`${food.name} added to cart!`);
    } else {
      toast.error(res.error || 'Could not add to cart.');
    }
  };

  return (
    <Card className="flex flex-col h-full">
      {/* Cover Image & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-350 hover:scale-103"
        />

        {/* Veg / Non-Veg Indicator Icon */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 p-1 rounded-lg shadow-sm border border-slate-100 dark:border-slate-850">
          <CircleDot
            className={`h-4.5 w-4.5 ${food.isVeg ? 'text-emerald-500 fill-emerald-500' : 'text-red-500 fill-red-500'}`}
          />
        </div>

        {/* Favorite Icon */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full glass border border-white/20 hover:scale-110 active:scale-95 transition-all text-slate-800 dark:text-white"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-700 dark:text-white'
            }`}
          />
        </button>

        {/* Bestseller Badge */}
        {food.isBestseller && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="premium">Bestseller</Badge>
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h4 className="font-bold text-slate-900 dark:text-slate-50 text-base line-clamp-1">
              {food.name}
            </h4>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{food.rating}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {food.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/85 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-950 dark:text-white">
              ${food.price.toFixed(2)}
            </span>
            {food.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${food.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-2.5 bg-orange-500 text-white rounded-xl px-2 py-1 shadow-md shadow-orange-500/10">
              <button
                onClick={() => updateQuantity(food.id, quantity - 1)}
                className="p-1 hover:bg-white/10 rounded-lg active:scale-90 transition-transform cursor-pointer"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs font-bold w-4 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(food.id, quantity + 1)}
                className="p-1 hover:bg-white/10 rounded-lg active:scale-90 transition-transform cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToCart}
              className="rounded-xl border-orange-500/25 hover:border-orange-500 hover:bg-orange-500 hover:text-white text-orange-500 font-bold flex items-center gap-1 py-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
