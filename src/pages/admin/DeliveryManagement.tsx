import React, { useState } from 'react';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Star, Truck, Shield, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';

interface Rider {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  status: 'active' | 'busy' | 'offline';
  completedDeliveries: number;
}

export const DeliveryManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const [riders] = useState<Rider[]>([
    { id: 'dp-1', name: 'Marcus Swift', phone: '+1 (555) 998-1123', vehicle: 'Motorcycle (Silver)', rating: 4.9, status: 'busy', completedDeliveries: 412 },
    { id: 'dp-2', name: 'Sarah Connor', phone: '+1 (555) 098-7654', vehicle: 'Scooter (Red)', rating: 4.8, status: 'active', completedDeliveries: 289 },
    { id: 'dp-3', name: 'Alex Johnson', phone: '+1 (555) 012-3456', vehicle: 'E-Bike (Black)', rating: 4.9, status: 'active', completedDeliveries: 567 },
    { id: 'dp-4', name: 'Elena Rostova', phone: '+1 (555) 321-7890', vehicle: 'Scooter (White)', rating: 4.7, status: 'offline', completedDeliveries: 156 },
  ]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'busy': return 'warning';
      default: return 'secondary';
    }
  };

  const filteredRiders = riders.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.vehicle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="max-w-sm w-full">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rider name or vehicle..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <Card className="hover:shadow-none p-4">
        <Table
          data={filteredRiders}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Rider ID', accessor: 'id', className: 'font-mono text-slate-500 font-bold' },
            { header: 'Rider Name', accessor: 'name', className: 'font-bold text-slate-850 dark:text-white' },
            { header: 'Phone', accessor: 'phone' },
            { header: 'Vehicle', accessor: 'vehicle' },
            {
              header: 'Rating',
              accessor: (row) => (
                <span className="flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {row.rating}
                </span>
              )
            },
            {
              header: 'Jobs Done',
              accessor: (row) => `${row.completedDeliveries} trips`
            },
            {
              header: 'Status',
              accessor: (row) => (
                <Badge variant={getStatusVariant(row.status)} className="capitalize py-0.5 px-2">
                  {row.status}
                </Badge>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};
