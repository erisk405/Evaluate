"use client"
import React, { useState } from "react";
import { addDays, format, startOfWeek } from 'date-fns';

// ฟังก์ชันคำนวณวันที่ 7 วัน
const getWeekDays = (startDate: Date) => {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // เริ่มวันจันทร์
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

const DatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const weekDays = getWeekDays(selectedDate);
  
    const handleDayClick = (date: Date) => {
      setSelectedDate(date);
    };
  return (
    <div className={`shadow-md rounded-xl overflow-hidden w-full `}>
      <div className="flex justify-center">
        {weekDays.map((date) => (
          <div
            key={date.toString()}
            className={`p-2 m-1 cursor-pointer rounded-lg ${
              format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => handleDayClick(date)}
          >
            {format(date, "EEE dd")} {/* แสดงวันและวันที่ */}
          </div>
        ))}
      </div>
    </div>
  );
};


export default DatePicker;
