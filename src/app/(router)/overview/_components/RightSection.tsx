"use client";
import React, { useEffect, useState } from "react";
import CarouselSection from "./CarouselSection";
import { TextEffect } from "@/app/_components/motion/TextEffect";
import { motion } from "framer-motion";
import DepartmentSection from "./DepartmentSection";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlarmClockPlus,
  ArrowRight,
  CalendarClock,
  ChevronDown,
  Clock9,
  Dot,
  EllipsisVertical,
} from "lucide-react";
import GlobalApi from "@/app/_unit/GlobalApi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { DateTimePicker24h } from "./DateTimePicker24h";

interface TimeRange {
  from?: Date;
  to?: Date;
}
const RightSection = () => {
  const defaultDate = new Date(new Date().getFullYear(), new Date().getMonth()); // ปีและเดือนปัจจุบัน
  const [checkPermission, setCheckPermission] = useState();

  const [time, setTime] = useState<Date | undefined>(undefined);
  const fetchProtected = async () => {
    try {
      const response = await GlobalApi.fetchProtected();
      setCheckPermission(response?.data?.role);
    } catch (error) {
      console.error({ message: error });
    }
  };
  const [show, setShow] = useState(false);
  // State สำหรับเก็บค่า date range
  const [date, setDate] = useState<DateRange | undefined>();
  // State สำหรับเก็บค่าเวลา
  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: new Date(),
    to: new Date(),
  });
  // Handler สำหรับจัดการการเปลี่ยนแปลงเวลา
  const handleTimeChange = (type: "from" | "to") => (newTime: Date) => {
    setTimeRange((prev) => ({
      ...prev,
      [type]: newTime,
    }));
  };
  useEffect(() => {
    fetchProtected();
  }, []);
  return (
    <div className="flex gap-3 flex-col h-full">
      <motion.div
        className="@container"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        <div className="rounded-2xl flex @[23rem]:flex-row @[23rem]:items-start flex-col justify-center items-center shadow-sm border w-auto bg-white ">
          <Calendar
            className="border-b @[23rem]:border-r"
            classNames={{
              day_selected:
                "w-full  bg-primary rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-blue-500 rounded-md text-white",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-500 opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            initialFocus
            mode="range"
            defaultMonth={defaultDate}
            // selected prop ควรเป็น Date หรือ { from: Date, to: Date } สำหรับ mode="range"
            selected={{
              from: new Date(2024, 9, 24),
              to: new Date(2024, 9, 28),
            }}
            numberOfMonths={1}
          />
          <div className="py-4 px-1">
            <div className="grid gap-3 items-center">
              <div className="flex items-center">
                <div className="relative">
                  <Dot strokeWidth={8} className="text-blue-500" />
                  <Dot
                    strokeWidth={8}
                    className="absolute top-0 text-blue-500 animate-ping"
                  />
                </div>
                <h2>วันปัจจุบัน</h2>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <Dot strokeWidth={8} />
                  <Dot
                    strokeWidth={8}
                    className="absolute top-0 animate-ping"
                  />
                </div>
                <h2>วันเริ่ม-สิ้นสุด</h2>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {checkPermission === "admin" ? (
        <motion.div
          className="bg-white px-5 border h-full shadow-md rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.2,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.1,
          }}
        >
          <div className="font-bold text-xl flex items-center gap-3 py-5 bg-white relative z-30">
            <TextEffect preset="slide">กำหนด วัน-เวลา การประเมิน</TextEffect>
            <AlarmClockPlus className="text-blue-500" />
          </div>
          <div className="bg-white relative z-50 border-t border-b">
            <div className="flex justify-between items-center my-3 shadow bg-neutral-50 hover:bg-neutral-100 w-full rounded-xl p-2">
              <div>
                <div className="flex items-center">
                  <div className="relative">
                    <Dot
                      strokeWidth={6}
                      className="absolute text-green-500 animate-ping"
                    />
                    <Dot strokeWidth={6} className="text-green-500" />
                  </div>
                  <h2>รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567</h2>
                </div>
                <div className="px-6">
                  <div className="flex items-center gap-1">
                    <CalendarClock size={18} />
                    <h2>24/10/67</h2>
                    <ArrowRight size={18} />
                    <h2>28/10/67</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock9 size={18} />
                    <h2>12:30 น.</h2>
                    <ArrowRight size={18} />
                    <h2>17:30 น.</h2>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>เมนู</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>แก้ไข</DropdownMenuItem>
                  <DropdownMenuItem>ลบรายการ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="w-full relative ">
            <form
              action=""
              className={`absolute px-2 transition-all ease-in-out duration-300 w-full ${
                show ? "translate-y-0 top-12" : "-translate-y-full"
              }`}
            >
              <div className="flex flex-col gap-3 items-center w-full shadow-inner p-4 bg-neutral-100 rounded-lg">
                {" "}
                <div className="grid gap-2 items-center w-full">
                  <Label className="">Title</Label>
                  <div className="">
                    <Input placeholder="รอบที่ x ประจำปีงบประมาณ พ.ศ. xxxx" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center w-full">
                  <Label className="col-span-1">From</Label>
                  <div className="col-span-3">
                    <DateTimePicker24h
                      onTimeChange={(date) =>
                        setTimeRange((prev) => ({ ...prev, from: date }))
                      }
                      defaultValue={timeRange.from}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center w-full">
                  <Label className="col-span-1">To</Label>
                  <div className="col-span-3">
                    <DateTimePicker24h
                      onTimeChange={(date) =>
                        setTimeRange((prev) => ({ ...prev, to: date }))
                      }
                      defaultValue={timeRange.to}
                    />
                  </div>
                </div>
                <Button>Save</Button>
              </div>
            </form>
            {/* ปุ่มเปิดแท็บ */}
            <div className="relative bg-white">
              <Button
                className="w-full mt-3"
                onClick={() => setShow(!show)}
                variant={"outline"}
              >
                <div className="flex items-center justify-between w-full">
                  กำหนดช่วงเวลา
                  <ChevronDown className={`${show ? 'rotate-180' : 'rotate-0'} transition-all`}/>
                </div>
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white p-5 border h-full shadow-md rounded-2xl"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.2,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.1,
          }}
        >
          <h2 className="font-bold text-xl">
            <TextEffect preset="slide">Department</TextEffect>
          </h2>
          <div className="mt-5">
            <DepartmentSection />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0, 0.71, 0.2, 1.01],
              delay: 0.6,
              scale: {
                type: "spring",
                damping: 10,
                stiffness: 100,
                restDelta: 0.001,
                delay: 0.6,
              },
            }}
            className="mt-5"
          >
            <CarouselSection />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RightSection;
