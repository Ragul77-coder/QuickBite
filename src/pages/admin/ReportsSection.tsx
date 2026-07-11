import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsSection: React.FC = () => {
  const triggerCSVDownload = (reportName: string) => {
    toast.success(`Exporting "${reportName}" as CSV...`);
    // Simulated CSV downloader
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8,Month,Revenue,Orders\nJan,18500,820\nFeb,20400,910\nMar,22100,980\nApr,24500,1100\nMay,27800,1220\nJun,28450,1284";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportName.toLowerCase().replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const reports = [
    { name: 'Revenue Summary 2026', desc: 'Full breakdown of monthly revenues, processing taxes and fee logs.', icon: DollarSign },
    { name: 'Order Logs Report', desc: 'Timestamps, restaurant pairings, totals and rider details histories.', icon: ShoppingBag },
    { name: 'Merchant Performance', desc: 'Ratings averages, cancelled rates, and foods bestseller lists.', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((rep, idx) => {
          const Icon = rep.icon;
          return (
            <Card key={idx} className="p-6 space-y-4 hover:shadow-none bg-white dark:bg-slate-900/40">
              <div className="h-10 w-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rep.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => triggerCSVDownload(rep.name)}
                className="w-full rounded-xl gap-1.5"
              >
                <Download className="h-4 w-4" /> Download CSV
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
