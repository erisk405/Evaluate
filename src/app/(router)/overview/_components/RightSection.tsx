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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { DateTimePicker24h } from "./DateTimePicker24h";
import { ScrollArea } from "@/components/ui/scroll-area";

type RightSectionProps = {
  permission?: string; // ใส่ ? เพื่อบอกว่าอาจเป็น undefined ได้
};
interface TimeRange {
  from?: Date;
  to?: Date;
}
const PerioaData = [
  {
    id: "PD01",
    title: "รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567",
    dateFrom: "01/07/2567",
    dataTo: "09/08/2567",
    timeFrom: "07:00",
    timeTo: "17:00",
    status: "start",
  },
  {
    id: "PD02",
    title: "รอบที่ 2 ประจำปีงบประมาณ พ.ศ. 2567",
    dateFrom: "01/09/2567",
    dataTo: "15/10/2567",
    timeFrom: "12:00",
    timeTo: "17:00",
    status: "waiting",
  },
  {
    id: "PD03",
    title: "รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2568",
    dateFrom: "28/01/2567",
    dataTo: "10/02/2567",
    timeFrom: "09:00",
    timeTo: "17:00",
    status: "end",
  },
  {
    id: "PD04",
    title: "รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2568",
    dateFrom: "28/01/2567",
    dataTo: "10/02/2567",
    timeFrom: "09:00",
    timeTo: "17:00",
    status: "end",
  },
  {
    id: "PD05",
    title: "รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2568",
    dateFrom: "28/01/2567",
    dataTo: "10/02/2567",
    timeFrom: "09:00",
    timeTo: "17:00",
    status: "end",
  },
];
const RightSection = ({ permission }: RightSectionProps) => {
  const defaultDate = new Date(new Date().getFullYear(), new Date().getMonth()); // ปีและเดือนปัจจุบัน
  const [time, setTime] = useState<Date | undefined>(undefined);
  const [show, setShow] = useState(false);
  // State สำหรับเก็บค่า date range
  const [date, setDate] = useState<DateRange | undefined>();
  // State สำหรับเก็บค่าเวลา
  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: new Date(),
    to: new Date(),
  });
  // แก้ไขฟังก์ชัน handleTimeChange สำหรับปุ่ม Save
  useEffect(() => {
    if (timeRange?.from && timeRange?.to) {
      console.log("TimeRange updated:", {
        from: timeRange.from.toLocaleString(),
        to: timeRange.to.toLocaleString(),
      });
    }
    console.log("timeRange:", timeRange);
  }, [timeRange]); // เพิ่ม timeRange เป็น dependency
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
      {/* ส่่วนของ admin */}
      {permission === "admin" ? (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.2,
            ease: [0, 0.71, 0.2, 1.01],
            delay: 0.1,
          }}
          className="bg-white p-5 border h-full shadow-md rounded-2xl"
        >
          <div
            className={`bg-white w-full 
            ${
              show
                ? "pb-72 transition-all ease-in-out duration-300"
                : "pb-5 transition-all ease-in-out duration-300"
            }  overflow-hidden`}
          >
            <div className="font-bold text-xl flex items-center gap-3 py-5 bg-white relative z-30">
              <TextEffect preset="slide">กำหนด วัน-เวลา การประเมิน</TextEffect>
              <AlarmClockPlus className="text-blue-500" />
            </div>
            <div className="bg-neutral-50 rounded-lg shadow-inner relative z-30 border-t border-b">
                <ScrollArea className="h-[410px] w-full px-3">
                  {PerioaData.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center my-3 shadow bg-white hover:bg-neutral-100 w-auto rounded-xl p-2"
                    >
                      <div className="w-full">
                        <div className="flex items-center">
                          <div className="relative">
                            <Dot
                              strokeWidth={6}
                              className={`absolute ${
                                item.status == "start"
                                  ? "text-green-500 "
                                  : item.status == "waiting"
                                  ? "text-yellow-500"
                                  : "text-black"
                              } animate-ping`}
                            />
                            <Dot
                              strokeWidth={6}
                              className={`${
                                item.status == "start"
                                  ? "text-green-500 "
                                  : item.status == "waiting"
                                  ? "text-yellow-500"
                                  : "text-black"
                              }`}
                            />
                          </div>
                          <h2>{item.title}</h2>
                        </div>
                        <div className="px-6">
                          <div className="flex items-center gap-1">
                            <CalendarClock size={18} />
                            <h2>{item.dateFrom}</h2>
                            <ArrowRight size={18} />
                            <h2>{item.dataTo}</h2>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock9 size={18} />
                            <h2>{item.timeFrom} น.</h2>
                            <ArrowRight size={18} />
                            <h2>{item.timeTo} น.</h2>
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
                  ))}
                </ScrollArea>
            </div>
            <div className="w-full relative ">
              {/* ------------------------------------ */}
              {/* แบบฟอร์มในการสร้างกำหนดช่วงเวลสการประเมิน */}
              {/* ------------------------------------ */}
              <div
                className={`absolute px-2 transition-all ease-in-out duration-300 w-full ${
                  show ? "translate-y-0 top-[100%]" : "-translate-y-full"
                }`}
              >
                <div className="flex flex-col gap-3 items-center w-full shadow-inner p-4 bg-white border rounded-br-lg rounded-bl-lg">
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
                        onTimeChange={
                          (
                            date // date คือค่าที่ได้จาก newDate จาก DateTimePicker24h
                          ) => setTimeRange((prev) => ({ ...prev, from: date })) // อัพเดท state โดยเก็บค่าเดิมและอัพเดทเฉพาะ from
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
                  <Button type="submit">Save</Button>
                </div>
              </div>
              {/* ปุ่มเปิดแท็บ */}
              <div className="relative bg-white">
                <Button
                  className="w-full mt-3"
                  onClick={() => setShow(!show)}
                  variant={"outline"}
                >
                  <div className="flex items-center justify-between w-full">
                    กำหนดช่วงเวลา
                    <ChevronDown
                      className={`${
                        show ? "rotate-180" : "rotate-0"
                      } transition-all`}
                    />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // ส่วนของ user เท่าไป
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
