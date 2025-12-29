
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, UtensilsCrossed } from 'lucide-react';
import { Role, DietType, MenuItem, Order, Patient, OrderStatus, Notification } from './types';
import { MENU_ITEMS, PATIENTS, INITIAL_ORDERS, MOCK_NOTIFICATIONS } from './mockData';
import { Button } from './components/Button';
import { NotificationPanel } from './components/NotificationPanel';
import { PatientModule } from './features/patient/PatientModule';
import { DoctorModule } from './features/doctor/DoctorModule';
import { KitchenModule } from './features/kitchen/KitchenModule';
import { AdminModule } from './features/admin/AdminModule';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [view, setView] = useState<string>('HOME');
  const [dbPatients, setDbPatients] = useState<Patient[]>(PATIENTS);
  const [dbOrders, setDbOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [cutOffHour] = useState(20); 
  
  const currentPatient = dbPatients.find(p => p.id === 'P2')!;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (role) setView('HOME');
  }, [role]);

  const addOrder = (order: Order) => {
    setDbOrders([order, ...dbOrders]);
    setDbPatients(prev => prev.map(p => p.id === order.patientId ? { ...p, orderStatus: 'ORDERED' } : p));
    
    const newNotif: Notification = {
      id: Math.random().toString(),
      title: 'Đơn hàng đã gửi',
      message: `Đơn #${order.id} của bạn đã được bếp tiếp nhận.`,
      type: 'ORDER',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setDbOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const newNotif: Notification = {
      id: Math.random().toString(),
      title: 'Cập nhật đơn hàng',
      message: `Đơn #${orderId} hiện có trạng thái: ${status}`,
      type: 'ORDER',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const updatePatientDiet = (patientId: string, diet: DietType) => {
    setDbPatients(prev => prev.map(p => p.id === patientId ? { ...p, dietType: diet } : p));
    const newNotif: Notification = {
      id: Math.random().toString(),
      title: 'Đổi chế độ ăn',
      message: `Bác sĩ đã chuyển bạn sang: ${diet}`,
      type: 'MEDICAL',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1cd991]/5 p-6">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-[#1cd991]/10">
          <div className="w-20 h-20 bg-[#1cd991] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#1cd991]/30 rotate-3">
            <UtensilsCrossed className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">MedMeal</h1>
          <p className="text-slate-400 font-bold mb-10 tracking-[0.2em] uppercase text-[8px]">Hệ thống dinh dưỡng bệnh viện</p>
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => setRole('PATIENT')} fullWidth className="py-4 text-xs tracking-widest uppercase">Bệnh nhân</Button>
            <Button onClick={() => setRole('DOCTOR')} variant="secondary" fullWidth className="py-4 text-xs tracking-widest uppercase">Bác sĩ / Điều dưỡng</Button>
            <Button onClick={() => setRole('KITCHEN')} variant="secondary" fullWidth className="py-4 text-xs tracking-widest uppercase">Nhà bếp</Button>
            <Button onClick={() => setRole('ADMIN')} variant="ghost" fullWidth className="text-slate-300 text-[8px] font-black uppercase tracking-[0.3em] mt-2">Administrator</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1cd991]/5 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#1cd991]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1cd991] rounded-lg flex items-center justify-center shadow-md shadow-[#1cd991]/20">
            <UtensilsCrossed className="text-white w-4 h-4" />
          </div>
          <div>
            <h2 className="font-black text-sm text-slate-900 leading-none">MedMeal</h2>
            <p className="text-[7px] font-black text-[#1cd991] uppercase tracking-widest mt-0.5">{role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsNotifOpen(true)} className="p-2 text-slate-400 relative">
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>}
          </button>
          <button onClick={() => { setRole(null); setView('HOME'); }} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${role}-${view}`} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.3 }}
          >
            {role === 'PATIENT' && <PatientModule 
              view={view} setView={setView} currentPatient={currentPatient} 
              menuItems={MENU_ITEMS} orders={dbOrders.filter(o => o.patientId === currentPatient.id)}
              cart={cart} setCart={setCart} selectedMenuItem={selectedMenuItem} 
              setSelectedMenuItem={setSelectedMenuItem} isCutOff={false} onPlaceOrder={addOrder}
            />}
            {role === 'DOCTOR' && <DoctorModule 
              view={view} setView={setView} patients={dbPatients} 
              updatePatientDiet={updatePatientDiet} orders={dbOrders}
            />}
            {role === 'KITCHEN' && <KitchenModule 
              view={view} setView={setView} orders={dbOrders} 
              updateOrderStatus={updateOrderStatus} menuItems={MENU_ITEMS}
            />}
            {role === 'ADMIN' && <AdminModule 
              view={view} setView={setView} orders={dbOrders} patients={dbPatients}
            />}
          </motion.div>
        </AnimatePresence>
      </main>

      <NotificationPanel 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? {...n, isRead: true} : n))}
        onMarkAllAsRead={() => setNotifications(notifications.map(n => ({...n, isRead: true})))}
      />
    </div>
  );
}
