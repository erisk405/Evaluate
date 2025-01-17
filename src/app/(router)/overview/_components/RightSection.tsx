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
  Atom,
  Building2,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CircleX,
  Clock9,
  Cog,
  DatabaseBackup,
  DatabaseZap,
  Dot,
  EllipsisVertical,
  HardDriveDownload,
  LockKeyhole,
  LockKeyholeOpen,
  X,
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
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import { PeriodType, TimeRange } from "@/types/interface";
import DeletePariod from "./DeletePariod";
import { toast } from "@/components/ui/use-toast";
import EditPariod from "./EditPariod";
import axios from "axios";
import useStore from "@/app/store/store";
import { useThemeStyles } from "@/hooks/useTheme";
import { Separator } from "@/components/ui/separator";

type RightSectionProps = {
  permission?: string; // ใส่ ? เพื่อบอกว่าอาจเป็น undefined ได้
  period?: PeriodType[];
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
const RightSection = ({ permission, period }: RightSectionProps) => {
  const defaultDate = new Date(new Date().getFullYear(), new Date().getMonth()); // ปีและเดือนปัจจุบัน
  const [show, setShow] = useState(false);
  const [expandedPeriodId, setExpandedPeriodId] = useState<string | null>(null); // เปิดถาดสำหรับการแก้ไขช่วงเวลา
  const [deletePeriod, setDeletePeroid] = useState("");
  // State สำหรับเก็บค่าเวลา
  const [openAlert, setOpenAlert] = useState(false);

  const styles = useThemeStyles();
  const { currentlyEvaluationPeriod, fetchCurrentPeriod } = useStore();
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
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        title: values.title,
        start: timeRange.from!.toISOString(),
        end: timeRange.to!.toISOString(),
      };
      const response = await GlobalApi.createPeriod(data);
      // fetch period ใหม่
      await fetchCurrentPeriod();
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
    } catch (error: unknown) {
      // ตรวจสอบว่า error เป็น instance ของ AxiosError หรือไม่
      if (axios.isAxiosError(error)) {
        // ถ้าเป็น AxiosError ให้ดึงข้อมูลจาก response
        toast({
          title: "เกิดข้อผิดพลาด",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(error.response?.data?.message, null, 2)}
              </code>
            </pre>
          ),
        });
      } else if (error instanceof Error) {
        // ถ้าเป็น instance ของ Error ทั่วไป
        toast({
          title: "เกิดข้อผิดพลาด",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(error.message, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        // กรณีที่ไม่สามารถระบุประเภทข้อผิดพลาดได้
        toast({
          title: "เกิดข้อผิดพลาดที่ไม่รู้จัก",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
              <code className="text-white whitespace-pre-wrap break-words">
                {JSON.stringify(error, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    }
  };

  const savePeriod = async (period_id: string) => {
    try {
      const payload = {
        period_id,
      };
      const response = await GlobalApi.saveEvaluationToHistory(payload);
      // console.log("Save", response?.data);
      toast({
        title: "ทำรายการสำเร็จ",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              บันทึกผลการประเมินเรียบร้อยแล้ว
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("API saveEvaluationToHistory", { message: error });
      return handleErrorOnAxios(error);
    }
  };

  useEffect(() => {
    const initializeFunction = async () => {
      await fetchCurrentPeriod();
    };
    if (!currentlyEvaluationPeriod) {
      initializeFunction();
    }
  }, []);

  return (
    <div className="flex gap-3 flex-col h-full">
      <div className="@container">
        {period && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={`rounded-2xl flex @[23rem]:flex-row @[23rem]:items-start 
              flex-col justify-center items-center shadow-sm border-none w-auto ${styles.text} ${styles.background}`}
          >
            <Calendar
              className={`@[23rem]:border-r`}
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
              selected={
                period.length > 0
                  ? {
                      from: period[0].start
                        ? new Date(period[0].start)
                        : undefined,
                      to: period[0].end ? new Date(period[0].end) : undefined,
                    }
                  : undefined
              }
              numberOfMonths={1}
            />
            <Separator className="@[23rem]:hidden" />
            <div className={`py-4 px-1 `}>
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
          </motion.div>
        )}
      </div>
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
          className={`${
            styles.background + " " + styles.text
          } px-5 h-full shadow rounded-2xl`}
        >
          <div
            className={`${styles.background} w-full 
            ${
              show
                ? "pb-72 transition-all ease-in-out duration-300"
                : "pb-5 transition-all ease-in-out duration-300"
            }  overflow-hidden`}
          >
            <div
              className={`${styles.background} text-xl flex items-center gap-3 py-5 relative z-30`}
            >
              <TextEffect preset="slide">กำหนด วัน-เวลา การประเมิน</TextEffect>
              <AlarmClockPlus className="text-blue-500" />
            </div>
            <div
              className={`${styles.background} rounded-lg shadow-inner relative z-30 border-t border-b`}
            >
              <ScrollArea className="max-h-[800px] w-full px-3">
                {period?.map((item, index) => (
                  <div
                    key={item.period_id}
                    className={`grid transition-all my-3 shadow ${styles.background_card} w-auto rounded-xl p-2`}
                  >
                    <div className="flex items-center">
                      <div className="relative w-full">
                        {/*-------------------------------------------- ------*/}
                        {/*               card ของ ช่วงเวลา                    */}
                        {/*-------------------------------------------- ------*/}
                        <div className="flex items-center ">
                          {/* Dot สถานะ */}
                          <div className="relative">
                            {new Date(item.start) <= new Date() &&
                            new Date() <= new Date(item.end) ? (
                              // Currently active period
                              <>
                                <Dot
                                  strokeWidth={6}
                                  className="absolute text-emerald-500 animate-ping"
                                />
                                <Dot
                                  strokeWidth={6}
                                  className="text-green-500"
                                />
                              </>
                            ) : new Date() > new Date(item.end) ? (
                              // past period
                              <>
                                <Dot
                                  strokeWidth={6}
                                  className="absolute text-gray-500 animate-ping"
                                />
                                <Dot
                                  strokeWidth={6}
                                  className="text-gray-500"
                                />
                              </>
                            ) : (
                              // Future period
                              <>
                                <Dot
                                  strokeWidth={6}
                                  className="absolute text-yellow-500 animate-ping"
                                />
                                <Dot
                                  strokeWidth={6}
                                  className="text-yellow-500"
                                />
                              </>
                            )}
                          </div>
                          {/* ชื่อรอบของช่วงเวลา */}
                          <div className="">
                            <h2>{item.title}</h2>
                          </div>
                        </div>
                        {/* การแสดงผลช่วงเวลา */}
                        <div className="pl-6  w-full">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex gap-3 items-center">
                              <span>📅</span>
                              <h2 className="truncate ">
                                {formatThaiDateTime(item.start).date}
                              </h2>
                            </div>
                            <div className="flex gap-3 items-center">
                              <ArrowRight size={18} />
                              <h2 className="truncate mr-auto">
                                {formatThaiDateTime(item.end).date}
                              </h2>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex gap-3 items-center">
                              <span>⏱️</span>
                              <h2 className="truncate">
                                {formatThaiDateTime(item.start).time} น.
                              </h2>
                            </div>
                            <div className="flex gap-3 items-center">
                              <ArrowRight size={18} />
                              <h2 className="truncate  mr-auto">
                                {formatThaiDateTime(item.end).time} น.
                              </h2>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {!item.backUp ? (
                              <div className="flex gap-3 items-center">
                                <div className="relative">
                                  <span className="absolute text-blue-500 animate-ping">
                                    🗄️
                                  </span>
                                  <span className="text-blue-500 ">🗄️</span>
                                </div>
                                <h2 className="truncate ">ยังไม่เก็บข้อมูล</h2>
                              </div>
                            ) : (
                              <div className="flex gap-3 items-center">
                                <div className="relative">
                                  <span className="absolute text-blue-500">
                                    🗄️
                                  </span>
                                  <span className="text-blue-500 ">🗄️</span>
                                </div>
                                <h2 className="truncate text-green-500">
                                  เก็บข้อมูลแล้ว
                                </h2>
                              </div>
                            )}

                            {!item.isAction ? (
                              <div className="flex gap-3 items-center">
                                <span>🔒</span>
                                <h2 className="truncate ">ยังไม่เปิดใช้งาน</h2>
                              </div>
                            ) : (
                              <div className="flex gap-3 items-center">
                                <span>🔓</span>
                                <h2 className="truncate ">เปิดใช้งานอยู่</h2>
                              </div>
                            )}
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
                            className="flex items-center gap-2"
                            onClick={() => savePeriod(item.period_id)}
                          >
                            <DatabaseBackup size={16} />
                            บันทึกผล
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onSelect={() =>
                              setExpandedPeriodId(
                                expandedPeriodId === item.period_id
                                  ? null
                                  : item.period_id
                              )
                            }
                          >
                            <Cog size={16} />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onSelect={() => {
                              setOpenAlert(true);
                              setDeletePeroid(item.period_id);
                            }}
                          >
                            <CircleX size={16} />
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
                    <AnimatePresence>
                      {expandedPeriodId === item.period_id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="">
                            <hr className="mt-3" />
                            <div
                              onClick={() => setExpandedPeriodId(null)}
                              className="flex justify-center w-full hover:bg-gray-50 rounded-lg"
                            >
                              <ChevronUp />
                            </div>
                            <EditPariod
                              defaultPeriod={item}
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
                    className={`flex flex-col gap-3 items-center w-full shadow p-4 ${styles.background_card} rounded-br-lg rounded-bl-lg`}
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="grid gap-2 items-center w-full">
                              <Label className="">ชื่อรอบการประเมิน</Label>
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
                      <Label className="col-span-1">เริ่มต้น</Label>
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
                      <Label className="col-span-1">สิ้นสุด</Label>
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
                    <Button type="submit">สร้างรอบการประเมิน</Button>
                  </form>
                </Form>
              </div>
              {/* ปุ่มเปิดแท็บ */}
              <div className={`relative bg-transparent`}>
                <Button
                  className="w-full"
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
        <>
          {period && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                ease: [0, 0.71, 0.2, 1.01],
                scale: {
                  type: "spring",
                  damping: 12,
                },
              }}
              className={`my-10 p-2 rounded-lg shadow ${styles.background}`}
            >
              <CarouselSection
                period={period}
                formatThaiDateTime={formatThaiDateTime}
              />
            </motion.div>
          )}
          <div className={`${styles.text}`}>
            <motion.div
              className={`p-5 h-auto shadow rounded-2xl ${styles.background}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0, 0.71, 0.2, 1.01],
                delay: 0.1,
              }}
            >
              <h2 className="text-xl flex items-center gap-1">
                <span className="text-2xl">💼</span>
                <TextEffect preset="slide">รายการแต่ละหน่วยงาน</TextEffect>
              </h2>
              <div className={`mt-5 border rounded-xl shadow-inner  `}>
                <DepartmentSection />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default RightSection;
