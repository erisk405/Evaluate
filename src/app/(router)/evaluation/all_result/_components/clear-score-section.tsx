"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BriefcaseBusiness,
  CalendarX,
  Dot,
  Download,
  FileText,
  ListCollapse,
  Loader,
  Search,
  SeparatorHorizontal,
  Shapes,
  Sheet,
  Workflow,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table } from "@tanstack/react-table";
import { PeriodType, User } from "@/types/interface";
import useStore from "@/app/store/store";
import { formatThaiDateTime } from "@/app/(router)/overview/_components/RightSection";
import { Item } from "@radix-ui/react-select";
import { useThemeStyles } from "@/hooks/useTheme";
import GlobalApi from "@/app/_util/GlobalApi";
import { toast } from "sonner";

// Define the props interface for the ClearScoreSection component
interface ClearScoreSectionProps {
  table: Table<User>;
  selectPeriod: PeriodType;
}
const ClearScoreSection = ({ table, selectPeriod }: ClearScoreSectionProps) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const selectData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original)
        .map((item) => item.id);
      // console.log("selectData",selectData);

      const payload = {
        allUserId: selectData,
        periodId: selectPeriod.period_id,
      };
      const response = await GlobalApi.deleteUserEvaluation(payload);
      console.log("response", response?.data);
      toast("ลบผลการประเมินเสร็จสิ้น", {
        description: `ระบบได้ลบผลการประเมินของ ${selectPeriod.title} เสร็จสิ้นแล้ว`,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error filtering employees:", error);
    } finally {
      setLoading(false);
    }
  };
  const { roles } = useStore();
  const styles = useThemeStyles();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ลบผลการประเมิน</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[565px]">
        <DialogHeader>
          <DialogTitle>ลบผลการประเมิน</DialogTitle>
          <DialogDescription>
            Make changes to your Export here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="genaral" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="genaral" className="flex items-center gap-2">
              <BriefcaseBusiness size={18} />
              genaral
            </TabsTrigger>
            <TabsTrigger value="detail" className="flex items-center gap-2">
              <ListCollapse size={18} />
              detail
            </TabsTrigger>
          </TabsList>
          {/* ใช้ในการ ตรวจสอบข้อมูลการจะ export */}
          <TabsContent value="genaral">
            {/* search bor */}
            {/* เลือกรอบการประเมินที่จะ export ออกมา */}
            <h2 className="my-3 text-sm">กำหนดการตั้งค่าต่างๆ</h2>
            <div className="grid grid-cols-1 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 ${styles.background_icon} rounded-full`}>
                    <CalendarX size={18} className={`${styles.text}`} />
                  </div>
                  <h2>รอบการประเมิน</h2>
                </div>
                <div className="text-sm">{selectPeriod?.title}</div>
              </div>
            </div>
            {/* รายชื่อทั้งหมดที่กำลังจะดำเนินการต่อใป ในการ export */}
            <h2 className="my-3 text-sm">รายชื่อที่จะดำเนินการทั้งหมด</h2>
            <div className=" flex flex-wrap">
              <ScrollArea className="max-h-[200px] gap-3">
                {table.getSelectedRowModel().rows.map((row) => (
                  <div
                    key={row.original.id}
                    className="inline-flex px-2 cursor-pointer items-center gap-1 rounded-xl border "
                  >
                    <Dot strokeWidth={6} className="text-blue-500" />
                    <h2 className="text-sm">{row.original.name}</h2>
                    <X
                      className="hover:bg-red-500 rounded-full hover:text-white"
                      size={14}
                      onClick={() => {
                        // สร้าง object ใหม่จาก row selection ปัจจุบัน
                        const newSelection = {
                          ...table.getState().rowSelection,
                        };
                        // ลบ row ที่เลือกออกโดยใช้ row.id
                        delete newSelection[row.id];
                        // อัปเดต row selection state
                        table.setRowSelection(newSelection);
                      }}
                    />
                  </div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="detail">
            {/* รายชื่อทั้งหมดที่กำลังจะดำเนินการต่อใป ในการ export */}
            <h2 className="my-3 text-sm">
              รายชื่อที่จะดำเนินการทั้งหมด ของการประเมิน
              {selectPeriod && selectPeriod.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <ScrollArea className="max-h-[200px]">
                {table.getSelectedRowModel().rows.map((row) => (
                  <div
                    key={row.original.id}
                    className="inline-flex px-2 items-center gap-1 rounded-xl border"
                  >
                    <Dot strokeWidth={6} className="text-blue-500" />
                    <h2 className="text-sm">{row.original.name}</h2>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-7">
              <div className="col-span-3 border-r px-2">
                <h2 className="text-sm mb-3">รายละเอียดโดยรวม</h2>
                {roles.map(
                  (role) =>
                    role.role_name !== "member" &&
                    role.role_name !== "admin" && (
                      <div
                        key={role.id}
                        className="col-span-1 grid grid-cols-3 mb-1 gap-2"
                      >
                        <h2 className="flex text-sm col-span-2 items-center gap-2">
                          <Workflow strokeWidth={1.5} size={20} />
                          {role.role_name}
                        </h2>
                        <div className="text-sm text-end">
                          {
                            table
                              .getSelectedRowModel()
                              .rows.filter(
                                (row) => row.original.role.id === role.id
                              ).length
                          }{" "}
                          คน
                        </div>
                        <h2 className="text-sm"></h2>
                      </div>
                    )
                )}
              </div>
              <div className="col-span-4 px-2 text-sm">
                <h2 className="text-sm mb-3">ช่วงเวลา</h2>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="col-span-1 text-end">ชื่อรอบ :</span>
                  <p className="col-span-2">
                    {selectPeriod && selectPeriod.title}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="col-span-1 text-end">เริ่มวันที่ :</span>
                  <p className="col-span-2">
                    {selectPeriod &&
                      formatThaiDateTime(selectPeriod.start)?.date}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="col-span-1 text-end">สิ้นสุดวันที่ :</span>
                  <p className="col-span-2">
                    {" "}
                    {selectPeriod && formatThaiDateTime(selectPeriod.end)?.date}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="col-span-1 text-end">การเก็บข้อมูล :</span>
                  <p className="col-span-2">
                    {selectPeriod && selectPeriod.backUp
                      ? "บันทึกแล้ว"
                      : "ยังไม่บันทึก"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <span className="col-span-1 text-end">สถานะ :</span>
                  <p className="col-span-2">
                    {selectPeriod && selectPeriod.isAction
                      ? "เปิดใช้งาน"
                      : "ยังไม่เปิดใช้งาน"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={() => handleSubmit()}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "ลบข้อมูลผลการประเมิน"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearScoreSection;
