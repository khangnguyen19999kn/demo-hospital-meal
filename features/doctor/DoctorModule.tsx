
import React, { useState, useMemo } from 'react';
import { Search, Stethoscope, Minus, AlertCircle, ClipboardList, TrendingUp, Users, Utensils } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Patient, DietType } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

interface DoctorModuleProps {
  view: string;
  setView: (view: string) => void;
  patients: Patient[];
  updatePatientDiet: (patientId: string, diet: DietType) => void;
  orders: any[];
}

export const DoctorModule = ({ view, setView, patients, updatePatientDiet, orders }: DoctorModuleProps) => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const stats = useMemo(() => {
    const total = patients.length;
    const ordered = patients.filter(p => p.orderStatus === 'ORDERED').length;
    const pending = total - ordered;
    return { total, ordered, pending };
  }, [patients]);

  const filteredPatients = patients.filter((p) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.room.includes(search)
  );

  return (
    <div className="space-y-10">
      <div className="flex bg-white/50 p-2 rounded-[2rem] w-fit border border-[#1cd991]/10 backdrop-blur-xl shadow-sm">
        <button onClick={() => setView('HOME')} className={`px-8 py-3 rounded-[1.5rem] text-[11px] font-black tracking-[0.2em] uppercase transition-all ${view === 'HOME' ? 'bg-[#1cd991] text-white shadow-xl shadow-[#1cd991]/30' : 'text-slate-400 hover:text-[#1cd991]'}`}>Tổng quan khoa</button>
        <button onClick={() => setView('REPORTS')} className={`px-8 py-3 rounded-[1.5rem] text-[11px] font-black tracking-[0.2em] uppercase transition-all ${view === 'REPORTS' ? 'bg-[#1cd991] text-white shadow-xl shadow-[#1cd991]/30' : 'text-slate-400 hover:text-[#1cd991]'}`}>Báo cáo dinh dưỡng</button>
      </div>

      {view === 'HOME' && (
        <>
          {/* Quick Stats Widget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-[#1cd991]/10 text-[#1cd991] rounded-2xl flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng bệnh nhân</p>
                  <p className="text-2xl font-black text-slate-800">{stats.total}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                  <Utensils size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã đặt suất</p>
                  <p className="text-2xl font-black text-emerald-600">{stats.ordered}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chưa đặt suất</p>
                  <p className="text-2xl font-black text-rose-500">{stats.pending}</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-between pt-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Hồ sơ Khoa</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-2.5 h-2.5 bg-[#1cd991] rounded-full shadow-[0_0_10px_#1cd991]"></div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">BS. Hoàng Tuấn đang trực</p>
              </div>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1cd991]" size={22} />
              <input 
                type="text" 
                placeholder="Tìm tên hoặc số phòng..." 
                className="w-full pl-14 pr-8 py-4.5 bg-white border border-slate-100 rounded-3xl text-sm font-bold focus:ring-[12px] focus:ring-[#1cd991]/5 focus:border-[#1cd991]/40 outline-none shadow-sm transition-all" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPatients.map((p) => (
              <div key={p.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm hover:shadow-2xl hover:border-[#1cd991]/20 transition-all space-y-6 group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-3xl text-slate-800 tracking-tighter group-hover:text-[#1cd991] transition-colors">P.{p.room}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{p.bed} - {p.name}</p>
                  </div>
                  <Badge variant={p.orderStatus === 'ORDERED' ? 'success' : 'warning'}>
                    {p.orderStatus === 'ORDERED' ? 'Đã đặt' : 'Chưa đặt'}
                  </Badge>
                </div>

                <div className="p-5 bg-[#1cd991]/5 rounded-2xl border border-[#1cd991]/10">
                  <p className="text-[10px] text-[#1cd991] font-black uppercase tracking-[0.25em] mb-1.5 opacity-60">Chỉ định dinh dưỡng</p>
                  <p className="text-base font-black text-slate-700">{p.dietType}</p>
                </div>
                
                <Button variant="secondary" fullWidth onClick={() => setSelectedPatient(p)} className="py-4">
                  Sửa hồ sơ y tế
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Prescription Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-10 space-y-10 border border-[#1cd991]/20">
               <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                    <ClipboardList className="text-[#1cd991]" size={36} />
                    Chỉ định
                  </h2>
                  <button onClick={() => setSelectedPatient(null)} className="p-4 hover:bg-[#1cd991]/5 text-slate-300 hover:text-[#1cd991] rounded-3xl transition-all"><Minus size={28} /></button>
               </div>
               <div className="flex gap-10 items-end border-b border-slate-100 pb-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phòng</p>
                    <p className="text-5xl font-black tracking-tighter text-[#1cd991]">{selectedPatient.room}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bệnh nhân</p>
                    <p className="text-xl font-bold text-slate-800">{selectedPatient.name}</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                  {Object.values(DietType).map((type) => (
                    <button 
                      key={type} 
                      onClick={() => { updatePatientDiet(selectedPatient.id, type); setSelectedPatient(null); }} 
                      className={`text-left p-4 rounded-2xl border-2 font-black text-[10px] transition-all uppercase tracking-wider ${selectedPatient.dietType === type ? 'bg-[#1cd991] border-[#1cd991] text-white shadow-lg' : 'bg-white border-slate-50 text-slate-500 hover:bg-[#1cd991]/5'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
               <Button fullWidth onClick={() => setSelectedPatient(null)} className="py-5 text-xl">Xác nhận thay đổi</Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
