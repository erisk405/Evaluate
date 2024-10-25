import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CalendarIcon } from 'lucide-react';

interface DateTimePickerProps {
  onTimeChange?: (date: Date) => void;// รับ function callback ที่จะรับ parameter เป็น Date
  defaultValue?: Date;
}

export function DateTimePicker24h({ onTimeChange, defaultValue }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setSelectedDate(defaultValue);
    }
  }, [defaultValue]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(newDate);
      onTimeChange?.(newDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: number) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (type === "hour") {
        newDate.setHours(value);
      } else {
        newDate.setMinutes(value);
      }
      setSelectedDate(newDate);
      onTimeChange?.(newDate);
    } else {
      const newDate = new Date();
      if (type === "hour") {
        newDate.setHours(value);
      } else {
        newDate.setMinutes(value);
      }
      setSelectedDate(newDate);
      onTimeChange?.(newDate); // ส่ง newDate กลับไปยัง parent component
    }
  };

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full pl-3 text-left font-normal"
          >
            {selectedDate ? (
              formatDate(selectedDate)
            ) : (
              <span className="text-muted-foreground">MM/DD/YYYY HH:mm</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 24 }, (_, i) => i)
                    .reverse()
                    .map((hour) => (
                      <Button
                        key={hour}
                        size="icon"
                        variant={
                          selectedDate?.getHours() === hour
                            ? "default"
                            : "ghost"
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => handleTimeChange("hour", hour)}
                      >
                        {String(hour).padStart(2, '0')}
                      </Button>
                    ))}
                </div>
                <ScrollBar
                  orientation="horizontal"
                  className="sm:hidden"
                />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map(
                    (minute) => (
                      <Button
                        key={minute}
                        size="icon"
                        variant={
                          selectedDate?.getMinutes() === minute
                            ? "default"
                            : "ghost"
                        }
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => handleTimeChange("minute", minute)}
                      >
                        {String(minute).padStart(2, '0')}
                      </Button>
                    )
                  )}
                </div>
                <ScrollBar
                  orientation="horizontal"
                  className="sm:hidden"
                />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateTimePicker24h;