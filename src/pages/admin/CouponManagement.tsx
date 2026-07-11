import React, { useState } from 'react';
import { Coupon } from '../../types';
import { coupons as initialCoupons } from '../../data/mockData';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Plus, Trash2, Ticket, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isOpen, setIsOpen] = useState(false);

  // Form fields state
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('10');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [minOrder, setMinOrder] = useState('15');
  const [maxDiscount, setMaxDiscount] = useState('8');
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !description.trim()) {
      toast.error('Code and description are required.');
      return;
    }

    const newCoupon: Coupon = {
      id: `c-${Math.random().toString(36).substr(2, 9)}`,
      code: code.toUpperCase().trim(),
      discount: parseFloat(discount) || 10,
      discountType,
      minOrder: parseFloat(minOrder) || 15,
      maxDiscount: parseFloat(maxDiscount) || 8,
      description,
      validUntil,
      isActive: true,
    };

    setCoupons([...coupons, newCoupon]);
    toast.success(`Coupon "${newCoupon.code}" created successfully!`);
    
    // Clear inputs
    setCode('');
    setDescription('');
    setIsOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast.success('Coupon status changed.');
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Delete coupon "${code}"?`)) {
      setCoupons(coupons.filter((c) => c.id !== id));
      toast.success('Coupon deleted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header toolbars */}
      <div className="flex justify-end">
        <Button variant="primary" onClick={() => setIsOpen(true)} className="rounded-xl flex items-center gap-1">
          <Plus className="h-4.5 w-4.5" /> Add Coupon
        </Button>
      </div>

      {/* Main listings table */}
      <Card className="hover:shadow-none p-4">
        <Table
          data={coupons}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'Coupon Code', accessor: 'code', className: 'font-mono font-black text-orange-500' },
            { header: 'Description', accessor: 'description' },
            {
              header: 'Discount details',
              accessor: (row) => (
                <span className="font-extrabold text-slate-850 dark:text-white">
                  {row.discountType === 'percentage' ? `${row.discount}% Off` : `$${row.discount} Off`}
                </span>
              )
            },
            {
              header: 'Min. Order',
              accessor: (row) => `$${row.minOrder.toFixed(2)}`
            },
            { header: 'Valid Until', accessor: 'validUntil' },
            {
              header: 'Status',
              accessor: (row) => (
                <button
                  onClick={() => handleToggleActive(row.id)}
                  className="cursor-pointer"
                >
                  <Badge variant={row.isActive ? 'success' : 'danger'}>
                    {row.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </button>
              )
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500" onClick={() => handleDelete(row.id, row.code)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              ),
              className: 'w-20 text-right'
            }
          ]}
          emptyMessage="No promo codes configured"
        />
      </Card>

      {/* Add Coupon Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Coupon"
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Coupon Code" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="DISCOUNT30" />
            
            <div className="w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Cash ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Value" required type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            <Input label="Min Order ($)" required type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
            <Input label="Max Disc ($)" required type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} />
          </div>

          <Input label="Valid Until" required type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          <Input label="Promo Description" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="30% OFF up to $8 on orders above $15" />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-2">Cancel</Button>
            <Button type="submit" variant="primary" className="rounded-xl px-4 py-2">Save Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
