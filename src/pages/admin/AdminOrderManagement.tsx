import React, { useState, useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Order } from '../../types';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export const AdminOrderManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useAuthStore();
  const [search, setSearch] = useState('');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      case 'placed': case 'confirmed': return 'info';
      default: return 'warning';
    }
  };

  const handleStatusChange = (orderId: string, nextStatus: Order['status']) => {
    updateOrderStatus(orderId, nextStatus);
    toast.success(`Order status updated to ${nextStatus.replace(/_/g, ' ')}`);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.restaurant.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="max-w-sm w-full">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or restaurant..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <Card className="hover:shadow-none p-4">
        <Table
          data={filteredOrders}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Order ID', accessor: 'id', className: 'font-mono text-slate-500 font-bold' },
            { header: 'Restaurant', accessor: (row) => row.restaurant.name, className: 'font-semibold' },
            { header: 'Delivery Label', accessor: (row) => row.deliveryAddress.label },
            { header: 'Total Value', accessor: (row) => `$${row.total.toFixed(2)}`, className: 'font-bold' },
            {
              header: 'Order Status',
              accessor: (row) => (
                <Badge variant={getStatusVariant(row.status)} className="capitalize py-0.5 px-2.5">
                  {row.status.replace(/_/g, ' ')}
                </Badge>
              )
            },
            {
              header: 'Actions / Update',
              accessor: (row) => (
                <select
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-transparent border border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-350 outline-none focus:border-orange-500"
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ),
              className: 'w-48 text-right'
            }
          ]}
          emptyMessage="No customer orders matching query found"
        />
      </Card>
    </div>
  );
};
