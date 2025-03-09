import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onClose: () => void;
  onSelect: (date: string) => void;
  selectedDate?: string;
}

export function Calendar({ onClose, onSelect, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const days = ['d', 'l', 'm', 'm', 'j', 'v', 's'];

  const generateCalendarDays = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), -i);
      days.unshift({
        date,
        isCurrentMonth: false,
        key: `prev-${date.getTime()}`
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i);
      days.push({
        date,
        isCurrentMonth: true,
        key: `current-${date.getTime()}`
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(month.getFullYear(), month.getMonth() + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        key: `next-${date.getTime()}`
      });
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = formatDate(date);
    onSelect(formattedDate);
  };

  const isDateSelected = (date: Date) => {
    const formattedDate = formatDate(date);
    return formattedDate === selectedDate;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
      <div className="mb-4">
        <button
          className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
        >
          Últimos 7 Días
        </button>

        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={`header-${day}-${index}`} className="text-center text-sm text-gray-500 py-1">
              {day}
            </div>
          ))}
          {generateCalendarDays(currentMonth).map(({ date, isCurrentMonth, key }) => (
            <button
              key={key}
              onClick={() => handleDateClick(date)}
              className={`
                p-2 text-sm rounded-lg text-center
                ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                ${isDateSelected(date) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                ${isToday(date) ? 'font-bold' : ''}
              `}
            >
              {date.getDate()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cerrar
        </button>
        <button
          onClick={() => {
            if (selectedDate) {
              onSelect(selectedDate);
              onClose();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}