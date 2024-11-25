"use client";
import React, { useEffect, useState } from "react";
import CarouselSection from "./CarouselSection";
import { TextEffect } from "@/app/_components/motion/TextEffect";
import { AnimatePresence, motion } from "framer-motion";
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
  ChevronUp,
  Clock9,
  Dot,
  EllipsisVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateTimePicker24h } from "./DateTimePicker24h";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import GlobalApi from "@/app/_unit/GlobalApi";
import { PeriodType, TimeRange } from "@/types/interface";
import DeletePariod from "./DeletePariod";
import { toast } from "@/components/ui/use-toast";
import EditPariod from "./EditPariod";

type RightSectionProps = {
  permission?: string; // ใส่ ? เพื่อบอกว่าอาจเป็น undefined ได้
};

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "massage must be least 10 characters." })
    .max(100, { message: "massage must not exceed 100 characters." }),
});

export const formatThaiDateTime = (isoString: string) => {
  const date = new Date(isoString);

  // สร้าง formatter สำหรับวันที่ภาษาไทย
  const dateFormatter = new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // สร้าง formatter สำหรับเวลา
  const timeFormatter = new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const thaiDate = dateFormatter.format(date);
  const thaiTime = timeFormatter.format(date);

  return {
    date: thaiDate,
    time: `${thaiTime}`,
  };
};
const RightSection = ({ permission }: RightSectionProps) => {
  const defaultDate = new Date(new Date().getFullYear(), new Date().getMonth()); // ปีและเดือนปัจจุบัน
  const [show, setShow] = useState(false);
  const [expandedPeriodId, setExpandedPeriodId] = useState<string | null>(null); // เปิดถาดสำหรับการแก้ไขช่วงเวลา
  const [period, setPeriod] = useState<PeriodType[]>([]);
  const [deletePeriod, setDeletePeroid] = useState("");
  // State สำหรับเก็บค่าเวลา
  const [openAlert, setOpenAlert] = useState(false);

  const [timeRange, setTimeRange] = useState<TimeRange>({
    from: new Date(),
    to: new Date(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const fetchPeriod = async () => {
    try {
      const response = await GlobalApi.getPeriod();
      setPeriod(response?.data);
      console.log(response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        title: values.title,
        start: timeRange.from!.toISOString(),
        end: timeRange.to!.toISOString(),
      };
      const response = await GlobalApi.createPeriod(data);
      fetchPeriod();
      setShow(false);
      toast({
        title: "กำหนดช่วงเวลาเรียบร้อยแล้ว",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(response?.data, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error: any) {
      console.error({ message: error });
      toast({
        title: "เกิดข้อผิดพลาด",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(error.response.data.message, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };

  const fetchClosestPeriod = () => {
    const today = new Date();

    // กรอง periods ที่ยังไม่สิ้นสุด
    const validPeriods = period.filter((p) => new Date(p.end) >= today);

    // ถ้าไม่เจอ period ให้คืนค่าเป็น null
    if (validPeriods.length === 0) return null;
    // เรียง periods ตามความใกล้ของ `start` กับวันปัจจุบัน
    const closestPeriod = validPeriods.sort((a, b) => {
      const startA = new Date(a.start).getTime();
      const startB = new Date(b.start).getTime();
      return (
        Math.abs(startA - today.getTime()) - Math.abs(startB - today.getTime())
      );
    })[0]; // เอา period ที่ใกล้ที่สุดตัวแรก

    // console.log("Closest Period:", closestPeriod);
    return closestPeriod;
  };

  useEffect(() => {
    fetchPeriod();
  }, []);
  // แก้ไขฟังก์ชัน handleTimeChange สำหรับปุ่ม Save
  useEffect(() => {
    if (timeRange?.from && timeRange?.to) {
      console.log("TimeRange updated:", {
        from: timeRange.from.toLocaleString(),
        to: timeRange.to.toLocaleString(),
      });
    }
    // console.log("timeRange:", timeRange);
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
                "w-full bg-green-500 rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
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
              from: fetchClosestPeriod()?.start
                ? new Date(fetchClosestPeriod()!.start)
                : undefined,
              to: fetchClosestPeriod()?.end
                ? new Date(fetchClosestPeriod()!.end)
                : undefined,
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
                  <Dot strokeWidth={8} className="text-green-500" />
                  <Dot
                    strokeWidth={8}
                    className="absolute top-0 text-green-500 animate-ping"
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
          className="bg-white px-5 border h-full shadow-md rounded-2xl"
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
              <ScrollArea className="max-h-[800px] w-full px-3">
                {period?.map((item, index) => (
                  <div
                    key={item.period_id}
                    className="grid transition-all my-3 shadow bg-white w-auto rounded-xl p-2"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        {/*-------------------------------------------- ------*/}
                        {/*               card ของ ช่วงเวลา                    */}
                        {/*-------------------------------------------- ------*/}
                        <div className="flex items-center ">
                          {/* Dot สถานะ */}
                          <div className="relative">
                            <Dot
                              strokeWidth={6}
                              className={`absolute ${
                                new Date() > new Date(item.end)
                                  ? "text-blue-500 "
                                  : "text-emerald-500"
                              } animate-ping`}
                            />
                            <Dot
                              strokeWidth={6}
                              className={`${
                                new Date() > new Date(item.end)
                                  ? "text-blue-500 "
                                  : "text-green-500"
                              }`}
                            />
                          </div>
                          {/* ชื่อรอบของช่วงเวลา */}
                          <div className="">
                            <h2>{item.title}</h2>
                          </div>
                        </div>
                        {/* การแสดงผลช่วงเวลา */}
                        <div className="pl-6 ">
                          <div className="flex items-center gap-1">
                            <CalendarClock size={18} />
                            <h2>{formatThaiDateTime(item.start).date}</h2>
                            <ArrowRight size={18} />
                            <h2>{formatThaiDateTime(item.end).date}</h2>
                          </div>
                          <div className="flex items-center  gap-1">
                            <Clock9 size={18} />
                            <h2>{formatThaiDateTime(item.start).time} น.</h2>
                            <ArrowRight size={18} />
                            <h2>{formatThaiDateTime(item.end).time} น.</h2>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="ml-auto">
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>เมนู</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() =>
                              setExpandedPeriodId(
                                expandedPeriodId === item.period_id
                                  ? null
                                  : item.period_id
                              )
                            }
                          >
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setOpenAlert(true);
                              setDeletePeroid(item.period_id);
                            }}
                          >
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/*------------------------------------------------------*/}
                    {/*               card ของการแก้ไข ช่วงเวลา                */}
                    {/*-----------------------------------------------------*/}
                    {/* Edit section shown conditionally */}
                    {/* AnimatePresence มีไว้เพื่อ {expandedPeriodId === item.period_id && <motion.div>}) หรือเมื่อองค์ประกอบถูกลบ */}
                    {/* AnimatePresence จะ "สังเกต" การเปลี่ยนแปลงใน children และ:
                        ช่วยให้ animation ของ exit ทำงานเมื่อองค์ประกอบถูกลบ
                        ช่วยให้ animation ของ initial และ animate ทำงานเมื่อองค์ประกอบถูกเพิ่ม */}
                    <AnimatePresence mode="wait">
                      {expandedPeriodId === item.period_id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6">
                            <hr className="mt-3" />
                            <div
                              onClick={() => setExpandedPeriodId(null)}
                              className="flex justify-center w-full hover:bg-gray-50 rounded-lg"
                            >
                              <ChevronUp />
                            </div>
                            <EditPariod
                              defaultPeriod={item}
                              setTimeRange={setTimeRange}
                              timeRange={timeRange}
                              fetchPeriod={fetchPeriod}
                              setExpandedPeriodId={setExpandedPeriodId}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </ScrollArea>
              {/* -------------------------------------------- */}
              {/*         componentเมื่อต้องการลบ Period          */}
              {/* -------------------------------------------- */}
              <DeletePariod
                openAlert={openAlert}
                setOpenAlert={setOpenAlert}
                periodId={deletePeriod}
                refresh={fetchPeriod}
              />
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
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3 items-center w-full shadow p-4 bg-white rounded-br-lg rounded-bl-lg"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="grid gap-2 items-center w-full">
                              <Label className="">Title</Label>
                              <div className="w-full">
                                <Input
                                  placeholder="รอบที่ x ประจำปีงบประมาณ พ.ศ. xxxx"
                                  {...field}
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-4 items-center w-full">
                      <Label className="col-span-1">From</Label>
                      <div className="col-span-3">
                        <DateTimePicker24h
                          type="from"
                          otherDate={timeRange.to} // Pass the 'to' date for comparison
                          onTimeChange={
                            (
                              date // date คือค่าที่ได้จาก newDate จาก DateTimePicker24h
                            ) =>
                              setTimeRange((prev) => ({
                                ...prev,
                                from: date,
                              })) // อัพเดท state โดยเก็บค่าเดิมและอัพเดทเฉพาะ from
                          }
                          defaultValue={timeRange.from}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center w-full">
                      <Label className="col-span-1">To</Label>
                      <div className="col-span-3">
                        <DateTimePicker24h
                          type="to"
                          otherDate={timeRange.from} // Pass the 'from' date for comparison
                          onTimeChange={(date) =>
                            setTimeRange((prev) => ({ ...prev, to: date }))
                          }
                          defaultValue={timeRange.to}
                        />
                      </div>
                    </div>
                    <Button type="submit">Create Period</Button>
                  </form>
                </Form>
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
