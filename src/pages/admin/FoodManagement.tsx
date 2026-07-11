import React, { useState, useMemo } from 'react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { FoodItem } from '../../types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Star, Edit2, Trash2, Plus, Search, CircleDot } from 'lucide-react';
import toast from 'react-hot-toast';

export const FoodManagement: React.FC = () => {
  const { foods, restaurants, addFoodItem, updateFoodItem, deleteFoodItem } = useRestaurantStore();

  const [search, setSearch] = useState('');
  const [selectedRestoId, setSelectedRestoId] = useState<string>('All');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('9.99');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState('4.5');
  const [isVeg, setIsVeg] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);

  // Setup Edit Form data
  const openForm = (food: FoodItem | null) => {
    setSelectedFood(food);
    if (food) {
      setName(food.name);
      setRestaurantId(food.restaurantId);
      setCategory(food.category);
      setPrice(String(food.price));
      setOriginalPrice(food.originalPrice ? String(food.originalPrice) : '');
      setDescription(food.description);
      setImage(food.image);
      setRating(String(food.rating));
      setIsVeg(food.isVeg);
      setIsPopular(food.isPopular);
      setIsBestseller(food.isBestseller);
    } else {
      setName('');
      setRestaurantId(restaurants[0]?.id || '');
      setCategory('Burgers');
      setPrice('9.99');
      setOriginalPrice('');
      setDescription('');
      setImage('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop');
      setRating('4.5');
      setIsVeg(true);
      setIsPopular(false);
      setIsBestseller(false);
    }
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !restaurantId || !category.trim() || !image.trim()) {
      toast.error('Name, restaurant, category and thumbnail image are required.');
      return;
    }

    const payload = {
      name,
      restaurantId,
      category,
      price: parseFloat(price) || 9.99,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      description,
      image,
      rating: parseFloat(rating) || 4.5,
      isVeg,
      isPopular,
      isBestseller,
      reviewCount: selectedFood ? selectedFood.reviewCount : 0,
    };

    if (selectedFood) {
      updateFoodItem({ ...payload, id: selectedFood.id });
      toast.success('Menu item updated successfully!');
    } else {
      addFoodItem(payload);
      toast.success('Menu item added successfully!');
    }

    setIsOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteFoodItem(id);
      toast.success('Menu item deleted successfully.');
    }
  };

  // Filter listings by search and selected restaurant
  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      const matchesResto = selectedRestoId === 'All' ? true : f.restaurantId === selectedRestoId;
      return matchesSearch && matchesResto;
    });
  }, [foods, search, selectedRestoId]);

  return (
    <div className="space-y-6">
      {/* Header controls toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-1 w-full gap-3">
          <div className="max-w-xs flex-1">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dish or category..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          
          <select
            value={selectedRestoId}
            onChange={(e) => setSelectedRestoId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-350 outline-none focus:border-orange-500"
          >
            <option value="All">All Restaurants</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <Button variant="primary" onClick={() => openForm(null)} className="rounded-xl flex items-center gap-1">
          <Plus className="h-4.5 w-4.5" /> Add Menu Item
        </Button>
      </div>

      {/* Main listings table */}
      <Card className="hover:shadow-none p-4">
        <Table
          data={filteredFoods}
          keyExtractor={(row) => row.id}
          columns={[
            {
              header: 'Photo',
              accessor: (row) => (
                <img src={row.image} alt={row.name} className="h-10 w-14 rounded-lg object-cover bg-slate-100 shrink-0" />
              ),
              className: 'w-20'
            },
            { header: 'Dish Name', accessor: 'name', className: 'font-bold text-slate-850 dark:text-white' },
            {
              header: 'Restaurant',
              accessor: (row) => restaurants.find(r => r.id === row.restaurantId)?.name || 'Unknown Restaurant'
            },
            { header: 'Category', accessor: 'category' },
            {
              header: 'Price',
              accessor: (row) => (
                <span className="font-extrabold text-slate-950 dark:text-white">${row.price.toFixed(2)}</span>
              )
            },
            {
              header: 'Type',
              accessor: (row) => (
                <span className="flex items-center gap-1">
                  <CircleDot className={`h-4 w-4 ${row.isVeg ? 'text-emerald-500 fill-emerald-500' : 'text-red-500 fill-red-500'}`} />
                  <span className="text-xs font-semibold text-slate-650 dark:text-slate-350">{row.isVeg ? 'Veg' : 'Non-Veg'}</span>
                </span>
              )
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700" onClick={() => openForm(row)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500" onClick={() => handleDelete(row.id, row.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
              className: 'w-24 text-right'
            }
          ]}
          emptyMessage="No menu items match active selections"
        />
      </Card>

      {/* Add / Edit modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedFood ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Dish Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Truffle Pasta" />
            
            <div className="w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Restaurant Partner</label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm focus:ring-1 focus:ring-orange-500"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Category" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Pasta" />
            <Input label="Price ($)" required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input label="Original Price (Optional)" type="number" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            <Input label="Rating" required type="number" min="1" max="5" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>

          <Input label="Thumbnail Photo URL" required value={image} onChange={(e) => setImage(e.target.value)} />

          <div className="w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ingredients, servings, etc..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350">
              <input type="checkbox" checked={isVeg} onChange={() => setIsVeg(!isVeg)} className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
              <span>Veg Item</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350">
              <input type="checkbox" checked={isPopular} onChange={() => setIsPopular(!isPopular)} className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
              <span>Popular Item</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-350">
              <input type="checkbox" checked={isBestseller} onChange={() => setIsBestseller(!isBestseller)} className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
              <span>Bestseller</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-2">Cancel</Button>
            <Button type="submit" variant="primary" className="rounded-xl px-4 py-2">Save Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
