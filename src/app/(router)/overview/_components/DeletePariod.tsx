"use client";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GlobalApi from "@/app/_util/GlobalApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import useStore from "@/app/store/store";
import { PeriodType } from "@/types/interface";
import { Loader } from "lucide-react";
interface DeletePeriodAlertProps {
  openAlert: boolean;
  setOpenAlert: (openAlert: boolean) => void;
  periodId: string;
}

const DeletePariod = ({
  openAlert,
  setOpenAlert,
  periodId,
}: DeletePeriodAlertProps) => {
  const [check, setCheck] = useState(""); // check ให้แน่ใจว่าจะ Deleteจริงๆนะ
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCurrentPeriod } = useStore();
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await GlobalApi.deletePeriod(periodId);
      if (!response) {
        throw new Error(
          "ดำเนินการไม่สำเร็จ ตรวจสอบให้แน่ใจว่ามีข้อมูลไหนเชื่อมโยงกับช่วงเวลานี้อยู่"
        );
      }
      setCheck("");
      toast({
        title: "ระบบได้ลบช่วงเวลาในการประเมินนี้แล้ว",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(response?.data, null, 2)}
            </code>
          </pre>
        ),
      });
      await fetchCurrentPeriod();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(error?.response?.data?.message, null, 2)}
            </code>
          </pre>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* ----------------------------------- */}
      {/*         เมื่อต้องการลบ Period          */}
      {/* ----------------------------------- */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>คุณแน่ใจแล้วใช่ไหม?</AlertDialogTitle>
            <AlertDialogDescription>
              ระบบจะดำเนินการลบช่วงเวลานี้ออกจากฐานข้อมูลโดยถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Label className="text-red-500">
            หากคุณแน่ใจให้พิมพ์คำว่า "Delete"
          </Label>
          <Input
            onChange={(e) => setCheck(e.target.value)}
            placeholder="Delete"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              disabled={check !== "Delete"}
            >
              {isLoading ? (
                <div>
                  <Loader className="animate-spin" />
                </div>
              ) : (
                "ยืนยัน"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeletePariod;
