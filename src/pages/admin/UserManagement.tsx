import React, { useState } from 'react';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, UserCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input';

interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'partner';
  joinedDate: string;
}

export const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const [users] = useState<UserRow[]>([
    { id: 'u-1', name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 019-2834', role: 'customer', joinedDate: '2024-10-15' },
    { id: 'u-2', name: 'Alice Smith', email: 'alice.smith@example.com', phone: '+1 (555) 234-5678', role: 'customer', joinedDate: '2025-01-20' },
    { id: 'u-3', name: 'David Miller', email: 'david.miller@example.com', phone: '+1 (555) 345-6789', role: 'partner', joinedDate: '2024-12-05' },
    { id: 'u-4', name: 'Emily Watson', email: 'emily.watson@example.com', phone: '+1 (555) 456-7890', role: 'customer', joinedDate: '2026-03-12' },
    { id: 'u-5', name: 'Master Admin', email: 'admin@quickbite.com', phone: '+1 (555) 999-0000', role: 'admin', joinedDate: '2024-01-01' },
  ]);

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'partner': return 'info';
      default: return 'secondary';
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="max-w-sm w-full">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user name or email..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <Card className="hover:shadow-none p-4">
        <Table
          data={filteredUsers}
          keyExtractor={(row) => row.id}
          columns={[
            { header: 'User ID', accessor: 'id', className: 'font-mono text-slate-500 font-bold' },
            { header: 'User Name', accessor: 'name', className: 'font-bold text-slate-850 dark:text-white' },
            { header: 'Email Address', accessor: 'email' },
            { header: 'Phone', accessor: 'phone' },
            {
              header: 'Role',
              accessor: (row) => (
                <Badge variant={getRoleVariant(row.role)} className="capitalize py-0.5 px-2">
                  {row.role}
                </Badge>
              )
            },
            { header: 'Joined Date', accessor: 'joinedDate' }
          ]}
        />
      </Card>
    </div>
  );
};
