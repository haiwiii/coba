import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const CalendarWidget = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Normalize selectedDate to a Date instance (if provided as string)
  const parsedSelectedDate = selectedDate
    ? (selectedDate instanceof Date ? selectedDate : new Date(selectedDate))
    : null;

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (typeof onDateSelect === 'function') onDateSelect(selected);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit border-2 border-purple-300">
      
      {/* Header with Today Info */}
      <div className="mb-6 pb-5 border-b border-purple-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-gray-500 text-xs font-medium">Today</div>
            <div className="text-gray-900 text-base font-semibold">{todayStr}</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={handlePrevMonth}
            className="p-1">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-800 text-base">{monthName}</span>
          <button
            onClick={handleNextMonth}
            className="p-1">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div
              key={idx}
              className="text-center text-xs font-semibold text-gray-500 py-4">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const selected = parsedSelectedDate && day &&
              parsedSelectedDate.getFullYear() === currentMonth.getFullYear() &&
              parsedSelectedDate.getMonth() === currentMonth.getMonth() &&
              parsedSelectedDate.getDate() === day;

            return (
              <div
                key={idx}
                onClick={() => day && handleDayClick(day)}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                  ${!day ? 'invisible' : 'cursor-pointer'}
                  ${isToday(day)
                    ? 'bg-purple-600 text-white'
                    : day
                      ? 'text-gray-700 bg-gray-50'
                      : ''}
                  ${selected ? 'ring-2 ring-purple-300' : ''}
                `}
                role={day ? 'button' : undefined}
                aria-pressed={selected ? 'true' : 'false'}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;