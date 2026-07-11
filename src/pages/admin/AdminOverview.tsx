import React, { useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRestaurantStore } from '../../store/restaurantStore';
import { adminStats, revenueAnalytics } from '../../data/adminData';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Store,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const { orders } = useAuthStore();
  const { restaurants } = useRestaurantStore();

  // Combine live state counts with mock stats
  const stats = useMemo(() => {
    return [
      {
        label: 'Total Revenue',
        value: `$${adminStats.totalRevenue.toLocaleString()}`,
        icon: DollarSign,
        change: `+${adminStats.revenueChange}%`,
        isPositive: true,
        bg: 'bg-emerald-500/10 text-emerald-500',
      },
      {
        label: 'Orders Placed',
        value: String(adminStats.totalOrders + orders.length),
        icon: ShoppingBag,
        change: `+${adminStats.ordersChange}%`,
        isPositive: true,
        bg: 'bg-orange-500/10 text-orange-500',
      },
      {
        label: 'Active Users',
        value: String(adminStats.totalUsers),
        icon: Users,
        change: `+${adminStats.usersChange}%`,
        isPositive: true,
        bg: 'bg-blue-500/10 text-blue-500',
      },
      {
        label: 'Store Partners',
        value: String(restaurants.length),
        icon: Store,
        change: '0%',
        isPositive: true,
        bg: 'bg-purple-500/10 text-purple-500',
      },
    ];
  }, [orders, restaurants]);

  // Combine past orders to display on the table
  const recentOrdersData = useMemo(() => {
    return orders.slice(0, 5).map((o) => ({
      id: o.id,
      customer: o.deliveryAddress.label === 'Home' ? 'John Doe' : 'Jane Office',
      restaurant: o.restaurant.name,
      items: o.items.reduce((acc, i) => acc + i.quantity, 0),
      total: o.total,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString(),
    }));
  }, [orders]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Summary Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-6 space-y-4 hover:shadow-sm">
              <div className="flex justify-between items-start">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  {stat.value}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Analytical Revenue charts diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-4 hover:shadow-none bg-white dark:bg-slate-900/40">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-350">
              Revenue Analytics
            </h3>
            
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueAnalytics}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Live status timelines */}
        <div className="lg:col-span-4">
          <Card className="p-6 space-y-4 hover:shadow-none">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-350">
              Sales Targets
            </h3>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Monthly Sales Target</span>
                  <span className="text-slate-900 dark:text-white font-bold">85% Achieved</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Customer Support Rating</span>
                  <span className="text-slate-900 dark:text-white font-bold">4.9 / 5.0</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Rider Dispatch Efficiency</span>
                  <span className="text-slate-900 dark:text-white font-bold">92%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Orders table */}
      <Card className="p-6 space-y-4 hover:shadow-none bg-white dark:bg-slate-900/40">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-355">
          Recent Client Orders
        </h3>
        
        <Table
          data={recentOrdersData}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Order ID', accessor: 'id', className: 'font-mono font-bold text-slate-700' },
            { header: 'Restaurant', accessor: 'restaurant' },
            { header: 'Items Count', accessor: (row) => `${row.items} items` },
            { header: 'Total Value', accessor: (row) => `$${row.total.toFixed(2)}` },
            { header: 'Placed On', accessor: 'date' },
            {
              header: 'Status',
              accessor: (row) => (
                <Badge variant={getStatusVariant(row.status)} className="capitalize py-0.5 px-2.5">
                  {row.status.replace(/_/g, ' ')}
                </Badge>
              )
            }
          ]}
          emptyMessage="No recent orders to show"
        />
      </Card>
    </div>
  );
};
