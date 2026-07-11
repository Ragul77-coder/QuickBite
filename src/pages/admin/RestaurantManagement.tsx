import React, { useState, useMemo } from 'react';
import { useRestaurantStore } from '../../store/restaurantStore';
import { Restaurant } from '../../types';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Star, Edit2, Trash2, Plus, SlidersHorizontal, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const RestaurantManagement: React.FC = () => {
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useRestaurantStore();

  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResto, setSelectedResto] = useState<Restaurant | null>(null);

  // Form Fields state
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState('4.5');
  const [time, setTime] = useState('20-30 min');
  const [fee, setFee] = useState('1.99');
  const [minOrder, setMinOrder] = useState('10');
  const [image, setImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  // Sync / prepare fields for modal edit
  const openForm = (resto: Restaurant | null) => {
    setSelectedResto(resto);
    if (resto) {
      setName(resto.name);
      setCuisine(resto.cuisine.join(', '));
      setRating(String(resto.rating));
      setTime(resto.deliveryTime);
      setFee(String(resto.deliveryFee));
      setMinOrder(String(resto.minOrder));
      setImage(resto.image);
      setCoverImage(resto.coverImage);
      setAddress(resto.address);
      setDescription(resto.description);
    } else {
      setName('');
      setCuisine('');
      setRating('4.5');
      setTime('20-30 min');
      setFee('1.99');
      setMinOrder('10');
      setImage('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop');
      setCoverImage('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=400&fit=crop');
      setAddress('');
      setDescription('');
    }
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cuisine.trim() || !address.trim()) {
      toast.error('Name, cuisines, and address are required.');
      return;
    }

    const cuisinesList = cuisine.split(',').map((c) => c.trim()).filter(Boolean);

    const payload = {
      name,
      cuisine: cuisinesList,
      rating: parseFloat(rating) || 4.5,
      deliveryTime: time,
      deliveryFee: parseFloat(fee) || 0,
      minOrder: parseFloat(minOrder) || 10,
      image,
      coverImage,
      address,
      description,
      isOpen: selectedResto ? selectedResto.isOpen : true,
      isFeatured: selectedResto ? selectedResto.isFeatured : false,
      distance: selectedResto ? selectedResto.distance : '1.5 km',
      reviewCount: selectedResto ? selectedResto.reviewCount : 0,
    };

    if (selectedResto) {
      updateRestaurant({ ...payload, id: selectedResto.id });
      toast.success('Restaurant updated successfully!');
    } else {
      addRestaurant(payload);
      toast.success('Restaurant added successfully!');
    }

    setIsOpen(false);
  };

  const handleToggleOpenStatus = (resto: Restaurant) => {
    updateRestaurant({ ...resto, isOpen: !resto.isOpen });
    toast.success(`${resto.name} is now ${resto.isOpen ? 'Closed' : 'Open'}.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This removes all matching food items.`)) {
      deleteRestaurant(id);
      toast.success('Restaurant deleted successfully.');
    }
  };

  // Filter listings
  const filteredRestos = useMemo(() => {
    return restaurants.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
  }, [restaurants, search]);

  return (
    <div className="space-y-6">
      {/* Header tool controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full max-w-sm">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resto name..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button variant="primary" onClick={() => openForm(null)} className="rounded-xl flex items-center gap-1">
          <Plus className="h-4.5 w-4.5" /> Add Restaurant
        </Button>
      </div>

      {/* Main listings table */}
      <Card className="hover:shadow-none p-4">
        <Table
          data={filteredRestos}
          keyExtractor={(row) => row.id}
          columns={[
            {
              header: 'Cover',
              accessor: (row) => (
                <img src={row.image} alt={row.name} className="h-10 w-14 rounded-lg object-cover bg-slate-100 shrink-0" />
              ),
              className: 'w-20'
            },
            { header: 'Restaurant Name', accessor: 'name', className: 'font-bold text-slate-850 dark:text-white' },
            { header: 'Cuisine Tags', accessor: (row) => row.cuisine.join(', ') },
            {
              header: 'Rating',
              accessor: (row) => (
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {row.rating}
                </span>
              )
            },
            {
              header: 'Store Status',
              accessor: (row) => (
                <button
                  onClick={() => handleToggleOpenStatus(row)}
                  className="cursor-pointer"
                >
                  <Badge variant={row.isOpen ? 'success' : 'danger'}>
                    {row.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </button>
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
          emptyMessage="No restaurants found matching filter query"
        />
      </Card>

      {/* Add / Edit modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedResto ? 'Edit Restaurant' : 'Add New Restaurant'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Restaurant Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="The Golden Grill" />
            <Input label="Cuisine Tags (Comma separated)" required value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="Burgers, American, BBQ" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Min Order ($)" required type="number" step="0.5" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
            <Input label="Delivery Fee ($)" required type="number" step="0.1" value={fee} onChange={(e) => setFee(e.target.value)} />
            <Input label="Delivery Time" required value={time} onChange={(e) => setTime(e.target.value)} placeholder="20-30 min" />
            <Input label="Mock Rating" required type="number" min="1" max="5" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>

          <Input label="Thumbnail Image URL" required value={image} onChange={(e) => setImage(e.target.value)} />
          <Input label="Cover Banner Image URL" required value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
          <Input label="Street Address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, New York" />
          
          <div className="w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Store Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short description of the restaurant partner..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-2">Cancel</Button>
            <Button type="submit" variant="primary" className="rounded-xl px-4 py-2">Save Partner</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
