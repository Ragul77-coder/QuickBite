import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Settings, Shield, BellRing, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettings: React.FC = () => {
  const [taxRate, setTaxRate] = useState('8');
  const [deliveryBase, setDeliveryBase] = useState('2.99');
  const [platformName, setPlatformName] = useState('QuickBite');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Admin platform settings updated!');
  };

  return (
    <div className="max-w-2xl">
      <Card className="p-6 space-y-6 hover:shadow-none bg-white dark:bg-slate-900/40">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-750 dark:text-slate-350 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
          <Settings className="h-4.5 w-4.5 text-orange-500" /> Platform Configuration
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Platform Name"
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Standard GST/Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
            <Input
              label="Base Delivery Charge ($)"
              type="number"
              step="0.01"
              value={deliveryBase}
              onChange={(e) => setDeliveryBase(e.target.value)}
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-905 dark:text-white">Enable Restaurant Automatic Allocation</span>
                <span className="block text-[10px] text-slate-400 mt-0.5 font-semibold">Allocates order requests to riders within 2km automatically.</span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-slate-905 dark:text-white">Live Status Timelines Push Notifications</span>
                <span className="block text-[10px] text-slate-400 mt-0.5 font-semibold">Pushes mock desktop notifications for every rider waypoint progress.</span>
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button type="submit" variant="primary" className="rounded-xl px-5 gap-1.5 font-bold shadow-md shadow-orange-500/10">
              <Save className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
