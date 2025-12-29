
import React from 'react';
import { BarChart3, Settings } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Order, Patient } from '../../types';
import { Button } from '../../components/Button';

interface AdminModuleProps {
  view: string;
  setView: (view: string) => void;
  orders: Order[];
  patients: Patient[];
}

export const AdminModule = ({ view, setView, orders }: AdminModuleProps) => {
  const chartData = [
    { name: 'T2', value: 40 }, { name: 'T3', value: 65 }, { name: 'T4', value: 55 },
    { name: 'T5', value: 90 }, { name: 'T6', value: 85 }, { name: 'T7', value: 45 }, { name: 'CN', value: 30 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setView('HOME')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'HOME' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><BarChart3 size={16} /> Dashboard</button>
        <button onClick={() => setView('SETTINGS')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'SETTINGS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><Settings size={16} /> Cấu hình</button>
      </div>

      {view === 'HOME' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold mb-6">Thống kê đơn hàng</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'SETTINGS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
           <h2 className="text-xl font-bold mb-4">Cấu hình</h2>
           <div className="flex justify-between items-center">
             <span>Giờ khóa sổ đặt cơm</span>
             <input type="time" defaultValue="20:00" className="border rounded px-2 py-1" />
           </div>
        </div>
      )}
    </div>
  );
};
