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
import { toast } from '@/components/ui/use-toast';

interface DateTimePickerProps {
  onTimeChange?: (date: Date) => void;// รับ function callback ที่จะรับ parameter เป็น Date
  defaultValue?: Date;
  type: 'from' | 'to'; // Add a type prop to distinguish between from and to pickers
  otherDate?: Date; // Add prop to pass the other date for comparison
}

export function DateTimePicker24h({ onTimeChange, defaultValue  ,type, 
  otherDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultValue);

  useEffect(() => {
    // console.log("defaultValue",defaultValue);
    
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
  const isValidDate = (newDate: Date): boolean => {
    if (!otherDate) return true;

    if (type === 'from') {
      const toDate = new Date(otherDate);
      return newDate < toDate;
    } else {
      const fromDate = new Date(otherDate);
      return newDate > fromDate;
    }
  };
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      
      // Validation logic
      if (type === 'from' && otherDate) {
        const toDate = new Date(otherDate);
        if (newDate >= toDate) {
          toast({
            title: "Invalid Date",
            description: "From date must be earlier than To date",
            variant: "destructive"
          });
          return;
        }
      } else if (type === 'to' && otherDate) {
        const fromDate = new Date(otherDate);
        if (newDate <= fromDate) {
          toast({
            title: "Invalid Date",
            description: "To date must be later than From date",
            variant: "destructive"
          });
          return;
        }
      }

      // Preserve existing time if a date was already selected
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
      }
      setSelectedDate(newDate);
      onTimeChange?.(newDate);
    }
  };

  const handleTimeChange = (timeType: "hour" | "minute", value: number) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    
    if (timeType === "hour") {
      newDate.setHours(value);
    } else {
      newDate.setMinutes(value);
    }

    // Validation logic
    if (!isValidDate(newDate)) {
      toast({
        title: "Invalid Time",
        description: type === 'from' 
          ? "From date must be earlier than To date"
          : "To date must be later than From date",
        variant: "destructive"
      });
      return;
    }

    setSelectedDate(newDate);
    onTimeChange?.(newDate);
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
              disabled={(date) =>
                date < new Date() || date < new Date("1900-01-01")
              }
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