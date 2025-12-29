
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from '../../types';

interface CalendarProps {
  orders: Order[];
  onSelectDate: (date: Date) => void;
}

export const Calendar = ({ orders, onSelectDate }: CalendarProps) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const daysInMonth = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1).getDay();
  
  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const prevMonth = () => setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth() - 1));
  const nextMonth = () => setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth() + 1));

  const isOrderOnDay = (day: number) => {
    return orders.some(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getDate() === day && 
             orderDate.getMonth() === currDate.getMonth() && 
             orderDate.getFullYear() === currDate.getFullYear();
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    onSelectDate(new Date(currDate.getFullYear(), currDate.getMonth(), day));
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 border border-emerald-50 shadow-sm">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="font-black text-slate-800 tracking-tight">{monthNames[currDate.getMonth()]} {currDate.getFullYear()}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-emerald-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-emerald-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-300 mb-4 uppercase tracking-widest">
        <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasOrder = isOrderOnDay(day);
          const isSelected = selectedDay === day;
          return (
            <button 
              key={day} 
              onClick={() => handleDayClick(day)}
              className={`h-12 w-full flex flex-col items-center justify-center rounded-2xl transition-all relative
                ${isSelected ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 scale-105 z-10' : 'hover:bg-emerald-50 text-slate-600 font-bold'}
              `}
            >
              <span className="text-sm">{day}</span>
              {hasOrder && (
                <span className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${isSelected ? 'bg-white' : 'bg-emerald-400'}`}></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
