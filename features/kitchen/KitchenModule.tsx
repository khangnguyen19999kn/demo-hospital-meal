
import React, { useMemo, useState } from 'react';
import { LayoutDashboard, Package, Menu as MenuIcon, Printer, AlertTriangle, QrCode, Power } from 'lucide-react';
import { Order, MenuItem, OrderStatus } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { AnimatePresence, motion } from 'framer-motion';

interface KitchenModuleProps {
  view: string;
  setView: (view: string) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  menuItems: MenuItem[];
}

export const KitchenModule = ({ view, setView, orders, updateOrderStatus, menuItems: initialMenu }: KitchenModuleProps) => {
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [menuItems, setMenuItems] = useState(initialMenu);

  const productionSummary = useMemo(() => {
    const counts: Record<string, { name: string, qty: number }> = {};
    orders.forEach((ord) => {
      ord.items.forEach(i => {
        if (counts[i.item.id]) counts[i.item.id].qty += i.quantity;
        else counts[i.item.id] = { name: i.item.name, qty: i.quantity };
      });
    });
    return Object.values(counts);
  }, [orders]);

  const toggleStock = (id: string) => {
    setMenuItems(prev => prev.map(m => m.id === id ? { ...m, inStock: !m.inStock } : m));
  };

  return (
    <div className="space-y-8">
      <div className="flex bg-white/50 p-2 rounded-[2rem] w-fit border border-[#1cd991]/10 backdrop-blur-xl shadow-sm">
        {[
          { id: 'HOME', label: 'Sản xuất', icon: LayoutDashboard },
          { id: 'ORDERS', label: 'Đơn hàng', icon: Package },
          { id: 'MENU', label: 'Kho món', icon: MenuIcon },
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)} className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-[11px] font-black tracking-[0.2em] uppercase transition-all ${view === tab.id ? 'bg-[#1cd991] text-white shadow-xl shadow-[#1cd991]/30' : 'text-slate-400 hover:text-[#1cd991]'}`}>
            <tab.icon size={18} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {view === 'HOME' && (
        <div className="space-y-8">
          <div className="flex justify-between items-end">
             <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Tổng hợp chế biến</h2>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Số lượng cần chuẩn bị ngay</p>
             </div>
             <Button variant="secondary" className="border-[#1cd991]/20"><Printer size={18} /> In bảng kê</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productionSummary.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex justify-between items-center group">
                <div>
                  <h4 className="font-black text-xl text-slate-800 tracking-tight">{item.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Suất chuẩn bị</p>
                </div>
                <div className="text-4xl font-black text-[#1cd991] bg-[#1cd991]/5 w-20 h-20 flex items-center justify-center rounded-3xl group-hover:bg-[#1cd991] group-hover:text-white transition-all duration-500">
                  {item.qty}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'MENU' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Quản lý kho món ăn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {menuItems.map(item => (
               <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-50 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <Badge variant={item.inStock ? 'success' : 'danger'}>{item.inStock ? 'Còn món' : 'Đã hết'}</Badge>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleStock(item.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${item.inStock ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                  >
                    <Power size={24} />
                  </button>
               </div>
             ))}
          </div>
        </div>
      )}

      {view === 'ORDERS' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Mã / BN</th>
                <th className="px-8 py-6">Chi tiết</th>
                <th className="px-8 py-6">Trạng thái</th>
                <th className="px-8 py-6">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-[#1cd991] tracking-tighter text-lg">#{order.id}</p>
                    <p className="text-sm font-bold text-slate-700">{order.patientName}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">P.{order.room} - {order.bed}</p>
                  </td>
                  <td className="px-8 py-6">
                    {order.items.map((i, idx) => (
                      <p key={idx} className="text-sm font-medium text-slate-600">
                        <span className="font-black text-[#1cd991]">{i.quantity}x</span> {i.item.name}
                      </p>
                    ))}
                  </td>
                  <td className="px-8 py-6"><Badge variant={order.status === OrderStatus.COMPLETED ? 'success' : 'primary'}>{order.status}</Badge></td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPrintingOrder(order)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-[#1cd991] hover:bg-[#1cd991]/5 transition-all"
                      >
                        <Printer size={20} />
                      </button>
                      <Button variant="secondary" className="text-[10px] py-2 px-4 uppercase tracking-widest" onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERING)}>
                        {order.status === OrderStatus.PENDING ? 'Tiếp nhận' : order.status === OrderStatus.COOKING ? 'Giao hàng' : 'Cập nhật'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
