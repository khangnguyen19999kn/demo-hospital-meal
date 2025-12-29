
import React, { useState, useMemo } from 'react';
import { 
  Menu as MenuIcon, ShoppingCart, History, ChevronLeft, Plus, Minus, 
  Clock, CheckCircle2, ChefHat, Sparkles, UtensilsCrossed, Star,
  MapPin, Target, Truck, Heart, ArrowRight, Trash2, Filter, ChevronDown,
  Activity, Info, Share2, Zap
} from 'lucide-react';
import { MenuItem, Order, Patient, MealType, OrderStatus, DietType } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Calendar } from './Calendar';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface PatientModuleProps {
  view: string;
  setView: (view: string) => void;
  currentPatient: Patient;
  menuItems: MenuItem[];
  orders: Order[];
  cart: { item: MenuItem; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ item: MenuItem; quantity: number }[]>>;
  selectedMenuItem: MenuItem | null;
  setSelectedMenuItem: (item: MenuItem | null) => void;
  isCutOff: boolean;
  onPlaceOrder: (order: Order) => void;
}

export const PatientModule = ({ 
  view, setView, currentPatient, menuItems, orders, cart, setCart, 
  selectedMenuItem, setSelectedMenuItem, isCutOff, onPlaceOrder 
}: PatientModuleProps) => {

  const [activeMealType, setActiveMealType] = useState<MealType>(MealType.ALL);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showFamilyShare, setShowFamilyShare] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [orderNote, setOrderNote] = useState('');

  const cartTotal = useMemo(() => cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0), [cart]);

  // Tính toán dinh dưỡng thực tế đã nạp hôm nay
  const dailyNutrition = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const todayOrders = orders.filter(o => 
      new Date(o.createdAt).toLocaleDateString() === today && 
      o.status === OrderStatus.COMPLETED
    );

    let cal = 0, pro = 0, fiber = 0;
    todayOrders.forEach(o => {
      o.items.forEach(i => {
        cal += i.item.calories * i.quantity;
        pro += i.item.protein * i.quantity;
        fiber += (i.item.carbs * 0.1) * i.quantity; // Giả lập chất xơ
      });
    });

    return { cal, pro, fiber, goalCal: 2200, goalPro: 75 };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => orderStatusFilter === 'ALL' || o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const addToCart = (item: MenuItem) => {
    if (!item.inStock) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0 || isCutOff) return;
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 900 + 100)}`,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      room: currentPatient.room,
      bed: currentPatient.bed,
      items: [...cart],
      total: cartTotal,
      status: OrderStatus.PENDING,
      note: orderNote,
      createdAt: new Date().toISOString()
    };
    onPlaceOrder(newOrder);
    setCart([]);
    setOrderNote('');
    setView('TRACKING');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-slate-100 text-slate-600';
      case OrderStatus.COOKING: return 'bg-amber-100 text-amber-600';
      case OrderStatus.DELIVERING: return 'bg-blue-100 text-blue-600';
      case OrderStatus.COMPLETED: return 'bg-emerald-100 text-emerald-600';
      case OrderStatus.CANCELLED: return 'bg-rose-100 text-rose-600';
    }
  };

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return '25%';
      case OrderStatus.COOKING: return '50%';
      case OrderStatus.DELIVERING: return '75%';
      case OrderStatus.COMPLETED: return '100%';
      default: return '0%';
    }
  };

  const renderView = () => {
    switch (view) {
      case 'HOME':
        return (
          <div className="space-y-6">
            {/* 🏥 New Health Dashboard Widget */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <Activity className="text-[#1cd991]" size={18} />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Tiến trình hôm nay</span>
                 </div>
                 <button onClick={() => setShowFamilyShare(true)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-[#1cd991] transition-colors">
                    <Share2 size={16} />
                 </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-slate-400">Năng lượng</span>
                       <span className="text-[#1cd991]">{dailyNutrition.cal} / {dailyNutrition.goalCal} kcal</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.min(100, (dailyNutrition.cal/dailyNutrition.goalCal)*100)}%` }} 
                        className="h-full bg-[#1cd991]"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-slate-400">Chất đạm</span>
                       <span className="text-blue-400">{dailyNutrition.pro} / {dailyNutrition.goalPro} g</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.min(100, (dailyNutrition.pro/dailyNutrition.goalPro)*100)}%` }} 
                        className="h-full bg-blue-400"
                       />
                    </div>
                 </div>
              </div>

              {/* AI Suggestion Banner */}
              <div className="bg-[#1cd991]/5 border border-[#1cd991]/10 rounded-2xl p-4 flex gap-3 items-start">
                 <div className="w-8 h-8 bg-[#1cd991] rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="text-white fill-white" size={14} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-[#1cd991] uppercase tracking-widest mb-0.5">Lời khuyên của bác sĩ</p>
                    <p className="text-xs text-slate-600 leading-tight font-medium">
                       Dựa trên chỉ định <span className="font-bold text-[#1cd991]">{currentPatient.dietType}</span>, bác nên ưu tiên các món hấp và giảm bớt tinh bột vào buổi tối.
                    </p>
                 </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {Object.values(MealType).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMealType(m as MealType)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeMealType === m ? 'bg-[#1cd991] text-white shadow-lg shadow-[#1cd991]/20' : 'bg-white text-slate-400 border border-slate-50'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.filter(i => activeMealType === MealType.ALL || i.mealType === activeMealType).map((item) => {
                const isRecommended = item.dietType === currentPatient.dietType;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => { setSelectedMenuItem(item); setView('DETAIL'); }}
                    className={`bg-white rounded-3xl p-4 border shadow-sm flex gap-4 transition-all hover:shadow-md cursor-pointer ${isRecommended ? 'border-[#1cd991]/30 bg-gradient-to-br from-white to-[#1cd991]/5' : 'border-slate-50'}`}
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={item.image} className="w-full h-full object-cover" />
                      {isRecommended && (
                        <div className="absolute top-0 left-0 bg-[#1cd991] text-white p-1 rounded-br-xl">
                          <Star size={10} fill="white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.calories} kcal • {item.dietType}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[#1cd991]">{item.price.toLocaleString()}đ</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                          className="w-8 h-8 rounded-xl bg-[#1cd991]/10 text-[#1cd991] flex items-center justify-center active:scale-90 transition-transform"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'DETAIL':
        if (!selectedMenuItem) return null;
        return (
          <div className="space-y-6">
            <button onClick={() => setView('HOME')} className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest"><ChevronLeft size={18} /> Quay lại</button>
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-50">
               <img src={selectedMenuItem.image} className="w-full aspect-video object-cover" />
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-black text-slate-800">{selectedMenuItem.name}</h2>
                    <span className="text-xl font-black text-[#1cd991]">{selectedMenuItem.price.toLocaleString()}đ</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="primary">{selectedMenuItem.dietType}</Badge>
                    <Badge variant="neutral">{selectedMenuItem.mealType}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{selectedMenuItem.description}</p>
                  
                  {/* AI Detail insight */}
                  <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
                     <Info size={18} className="text-[#1cd991] shrink-0" />
                     <p className="text-xs text-slate-500 font-medium">Món ăn này có chỉ số GI thấp, giàu Omega-3 và Kali, cực kỳ tốt cho tiến trình phục hồi của bệnh nhân tim mạch/tiểu đường.</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 py-4 border-y border-slate-50">
                    {[{l:'Calo',v:selectedMenuItem.calories},{l:'Đạm',v:selectedMenuItem.protein},{l:'Carbs',v:selectedMenuItem.carbs},{l:'Béo',v:selectedMenuItem.fat}].map(s=>(
                      <div key={s.l} className="text-center">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">{s.l}</p>
                        <p className="font-black text-slate-700 text-xs">{s.v}g</p>
                      </div>
                    ))}
                  </div>
                  <Button fullWidth onClick={() => { addToCart(selectedMenuItem); setView('HOME'); }}>Thêm vào giỏ</Button>
               </div>
            </div>
          </div>
        );

      case 'CART':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800">Giỏ hàng của bạn</h2>
            {cart.length > 0 ? (
              <>
                <div className="space-y-3">
                  {cart.map(i => (
                    <div key={i.item.id} className="bg-white p-4 rounded-3xl border border-slate-50 flex items-center justify-between shadow-sm">
                       <div className="flex items-center gap-4">
                          <img src={i.item.image} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">{i.item.name}</h4>
                            <p className="text-[10px] text-[#1cd991] font-black">{i.item.price.toLocaleString()}đ</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl">
                          <button onClick={() => updateCartQuantity(i.item.id, -1)} className="p-1 text-slate-400"><Minus size={14}/></button>
                          <span className="font-black text-sm text-slate-800">{i.quantity}</span>
                          <button onClick={() => updateCartQuantity(i.item.id, 1)} className="p-1 text-[#1cd991]"><Plus size={14}/></button>
                       </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                   <textarea 
                      className="w-full bg-slate-50 rounded-2xl p-4 text-xs font-medium outline-none focus:ring-2 focus:ring-[#1cd991]/20 border-none"
                      placeholder="Ghi chú thêm cho nhà bếp (ít cơm, không cay...)"
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                   />
                   <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-bold text-slate-400">Tổng thanh toán</span>
                      <span className="text-2xl font-black text-[#1cd991]">{cartTotal.toLocaleString()}đ</span>
                   </div>
                   <Button fullWidth onClick={handlePlaceOrder}>Gửi đơn hàng ngay</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <ShoppingCart size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-400">Chưa có gì trong giỏ hàng</p>
                <Button variant="ghost" className="mt-4 text-[#1cd991]" onClick={() => setView('HOME')}>Quay lại Menu</Button>
              </div>
            )}
          </div>
        );

      case 'TRACKING':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-slate-800">Quản lý đơn hàng</h2>
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1cd991] border border-slate-50 shadow-sm">
                  <Filter size={18} />
               </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
               {['ALL', ...Object.values(OrderStatus)].map(st => (
                 <button 
                  key={st}
                  onClick={() => setOrderStatusFilter(st as any)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${orderStatusFilter === st ? 'bg-[#1cd991] text-white shadow-lg shadow-[#1cd991]/20' : 'bg-white text-slate-400 border border-slate-50'}`}
                 >
                   {st === 'ALL' ? 'Tất cả' : st}
                 </button>
               ))}
            </div>

            <LayoutGroup>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <motion.div 
                        layout
                        key={order.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[2rem] border border-slate-50 shadow-sm overflow-hidden"
                      >
                         <div 
                          className="p-5 flex justify-between items-center cursor-pointer"
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                         >
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="font-black text-slate-800 text-sm">#{order.id}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${getStatusColor(order.status)}`}>{order.status}</span>
                               </div>
                               <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {order.items.length} món</p>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-slate-800">{order.total.toLocaleString()}đ</p>
                               <ChevronDown size={18} className={`text-slate-300 transition-transform ml-auto mt-1 ${expandedOrderId === order.id ? 'rotate-180' : ''}`} />
                            </div>
                         </div>
                         
                         <AnimatePresence>
                           {expandedOrderId === order.id && (
                             <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 'auto' }} 
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-slate-50 bg-slate-50/30"
                             >
                               <div className="p-5 space-y-4">
                                  <div className="space-y-2">
                                     {order.items.map((i, idx) => (
                                       <div key={idx} className="flex justify-between text-xs font-bold text-slate-600">
                                          <span>{i.quantity}x {i.item.name}</span>
                                          <span>{(i.item.price * i.quantity).toLocaleString()}đ</span>
                                       </div>
                                     ))}
                                  </div>

                                  {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                                    <div className="py-4 space-y-3">
                                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-[#1cd991] transition-all duration-1000" style={{ width: getStepProgress(order.status) }}></div>
                                       </div>
                                       <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                                          <span className={order.status === OrderStatus.PENDING ? 'text-[#1cd991]' : ''}>Gửi đơn</span>
                                          <span className={order.status === OrderStatus.COOKING ? 'text-[#1cd991]' : ''}>Chế biến</span>
                                          <span className={order.status === OrderStatus.DELIVERING ? 'text-[#1cd991]' : ''}>Đang giao</span>
                                          <span className={(order.status as any) === OrderStatus.COMPLETED ? 'text-[#1cd991]' : ''}>Nhận món</span>
                                       </div>
                                    </div>
                                  )}

                                  {order.status === OrderStatus.COMPLETED && !order.rating && (
                                    <div className="bg-white p-4 rounded-2xl border border-[#1cd991]/10 flex flex-col items-center gap-3">
                                       <p className="text-[10px] font-black text-slate-500 uppercase">Bạn thấy món ăn thế nào?</p>
                                       <div className="flex gap-2">
                                          {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={18} className={tempRating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-100'} onClick={() => setTempRating(s)} />
                                          ))}
                                       </div>
                                       <Button className="py-1.5 px-6 text-[10px] rounded-full">Gửi đánh giá</Button>
                                    </div>
                                  )}
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 opacity-30">
                       <History size={48} className="mx-auto mb-4" />
                       <p className="font-bold">Không tìm thấy đơn hàng nào</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          </div>
        );

      case 'HISTORY':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800">Cá nhân & Sức khỏe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Calendar orders={orders} onSelectDate={() => {}} />
               <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-[#1cd991]/10 text-[#1cd991] rounded-2xl flex items-center justify-center">
                       <Target size={24} />
                     </div>
                     <div>
                       <h4 className="font-black text-slate-800">Chỉ số BMI & Cân nặng</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">Cập nhật bởi bác sĩ: 12/05</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-2xl font-black text-slate-700">65.5 <span className="text-sm font-bold text-slate-400">kg</span></span>
                        <Badge variant="success">-0.5kg</Badge>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Ghi chú y tế</p>
                        <p className="text-xs font-medium text-slate-600">{currentPatient.medicalNote || 'Duy trì chế độ ăn nhạt, tránh đường.'}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-180px)] pb-32">
      {renderView()}

      {/* Family Share Modal */}
      <AnimatePresence>
        {showFamilyShare && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 bg-[#1cd991]/10 text-[#1cd991] rounded-full flex items-center justify-center mx-auto">
                   <Share2 size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Người thân đặt hộ</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Gửi mã này cho người thân để họ có thể theo dõi và đặt suất ăn giúp bác từ xa.</p>
                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 aspect-square flex items-center justify-center">
                   {/* Mock QR Code */}
                   <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center text-white font-black opacity-10">QR CODE</div>
                </div>
                <Button fullWidth onClick={() => setShowFamilyShare(false)}>Đóng lại</Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-6 left-6 right-6 glass border border-white/60 rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-[50] shadow-2xl shadow-[#1cd991]/20">
        {[
          { icon: MenuIcon, label: 'Thực đơn', view: 'HOME' },
          { icon: ShoppingCart, label: 'Giỏ hàng', view: 'CART', badge: cart.length },
          { icon: Clock, label: 'Đơn hàng', view: 'TRACKING' },
          { icon: History, label: 'Cá nhân', view: 'HISTORY' },
        ].map((btn) => {
          const isActive = view === btn.view || (btn.view === 'HOME' && view === 'DETAIL');
          return (
            <button 
              key={btn.view} 
              onClick={() => { setView(btn.view); setSelectedMenuItem(null); }} 
              className={`flex flex-col items-center gap-1.5 transition-all relative ${isActive ? 'text-[#1cd991] scale-110' : 'text-slate-300 hover:text-[#1cd991]/60'}`}
            >
              <btn.icon size={24} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[8px] font-black tracking-widest uppercase ${isActive ? 'opacity-100' : 'opacity-40'}`}>{btn.label}</span>
              {btn.badge > 0 && (
                <span className="absolute -top-3 -right-3 bg-[#1cd991] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                  {btn.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
