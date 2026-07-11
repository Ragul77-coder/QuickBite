import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart } from 'lucide-react';
import { Restaurant } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { wishlist, toggleFavoriteRestaurant, isAuthenticated } = useAuthStore();
  const isFavorite = wishlist.restaurantIds.includes(restaurant.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <Link to={`/restaurant/${restaurant.id}`} className="block group">
      <Card className="h-full flex flex-col">
        {/* Cover Image & Tags */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />

          {/* Favorite Toggle Button */}
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

          {/* Featured/Promo Badge */}
          {restaurant.promo && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="primary" className="py-1 px-2.5 backdrop-blur-md bg-orange-500/90 text-white font-bold border-none shadow-lg shadow-orange-500/10">
                {restaurant.promo}
              </Badge>
            </div>
          )}

          {/* Status Overlay */}
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-slate-900 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                Closed
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-slate-900 dark:text-slate-50 group-hover:text-orange-500 transition-colors text-base line-clamp-1">
                {restaurant.name}
              </h3>
              
              <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg border border-amber-200/30 dark:border-amber-900/10">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{restaurant.rating}</span>
              </div>
            </div>

            {/* Cuisines */}
            <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mb-3">
              {restaurant.cuisine.join(' • ')}
            </p>
          </div>

          {/* Logistics Indicators */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/80 pt-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span>{restaurant.distance}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>{restaurant.deliveryFee === 0 ? 'Free Delivery' : `$${restaurant.deliveryFee.toFixed(2)} Delivery`}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
