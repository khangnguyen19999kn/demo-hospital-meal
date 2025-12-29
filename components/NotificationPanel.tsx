
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Package, Stethoscope, Info, Check } from 'lucide-react';
import { Notification } from '../types';
import { Button } from './Button';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead }: NotificationPanelProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package className="text-[#1cd991]" size={18} />;
      case 'MEDICAL': return <Stethoscope className="text-blue-500" size={18} />;
      default: return <Info className="text-amber-500" size={18} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1cd991]/10 rounded-xl flex items-center justify-center text-[#1cd991]">
                  <Bell size={20} />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 tracking-tight">Thông báo</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trung tâm tin nhắn</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => onMarkAsRead(n.id)}
                    className={`p-4 rounded-[1.5rem] border transition-all cursor-pointer relative group ${n.isRead ? 'bg-white border-slate-50' : 'bg-[#1cd991]/5 border-[#1cd991]/20 shadow-sm'}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-slate-50' : 'bg-white shadow-sm'}`}>
                        {getTypeIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-bold ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</h4>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${n.isRead ? 'text-slate-400' : 'text-slate-600'}`}>
                          {n.message}
                        </p>
                      </div>
                    </div>
                    {!n.isRead && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-[#1cd991] rounded-full shadow-[0_0_8px_#1cd991]"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <Bell size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">Không có thông báo mới</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-50">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={onMarkAllAsRead}
                disabled={notifications.every(n => n.isRead)}
              >
                <Check size={18} /> Đánh dấu đã đọc tất cả
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
