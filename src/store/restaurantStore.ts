import { create } from 'zustand';
import { Restaurant, FoodItem } from '../types';
import { restaurants as initialRestaurants } from '../data/restaurants';
import { foods as initialFoods } from '../data/foods';

interface RestaurantState {
  restaurants: Restaurant[];
  foods: FoodItem[];
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => void;
  updateRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  addFoodItem: (food: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (food: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
}

const getStoredRestaurantData = () => {
  try {
    const savedRestaurants = localStorage.getItem('qb_restaurants');
    const savedFoods = localStorage.getItem('qb_foods');
    return {
      restaurants: savedRestaurants ? JSON.parse(savedRestaurants) : initialRestaurants,
      foods: savedFoods ? JSON.parse(savedFoods) : initialFoods,
    };
  } catch (e) {
    return { restaurants: initialRestaurants, foods: initialFoods };
  }
};

const initialData = getStoredRestaurantData();

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: initialData.restaurants,
  foods: initialData.foods,

  addRestaurant: (restaurantData) => {
    set((state) => {
      const newRestaurant: Restaurant = {
        ...restaurantData,
        id: `r-${Math.random().toString(36).substr(2, 9)}`,
      };
      const updated = [...state.restaurants, newRestaurant];
      localStorage.setItem('qb_restaurants', JSON.stringify(updated));
      return { restaurants: updated };
    });
  },

  updateRestaurant: (updatedRestaurant) => {
    set((state) => {
      const updated = state.restaurants.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r);
      localStorage.setItem('qb_restaurants', JSON.stringify(updated));
      return { restaurants: updated };
    });
  },

  deleteRestaurant: (id) => {
    set((state) => {
      const updated = state.restaurants.filter(r => r.id !== id);
      const updatedFoods = state.foods.filter(f => f.restaurantId !== id);
      localStorage.setItem('qb_restaurants', JSON.stringify(updated));
      localStorage.setItem('qb_foods', JSON.stringify(updatedFoods));
      return { restaurants: updated, foods: updatedFoods };
    });
  },

  addFoodItem: (foodData) => {
    set((state) => {
      const newFood: FoodItem = {
        ...foodData,
        id: `f-${Math.random().toString(36).substr(2, 9)}`,
      };
      const updated = [...state.foods, newFood];
      localStorage.setItem('qb_foods', JSON.stringify(updated));
      return { foods: updated };
    });
  },

  updateFoodItem: (updatedFood) => {
    set((state) => {
      const updated = state.foods.map(f => f.id === updatedFood.id ? updatedFood : f);
      localStorage.setItem('qb_foods', JSON.stringify(updated));
      return { foods: updated };
    });
  },

  deleteFoodItem: (id) => {
    set((state) => {
      const updated = state.foods.filter(f => f.id !== id);
      localStorage.setItem('qb_foods', JSON.stringify(updated));
      return { foods: updated };
    });
  },
}));
