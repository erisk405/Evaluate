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

  const { fetchCurrentPeriod } = useStore();
  const handleDelete = async () => {
    try {
      const response = await GlobalApi.deletePeriod(periodId);
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Label className="text-red-500">
            If you're sure please typing "Delete"
          </Label>
          <Input
            onChange={(e) => setCheck(e.target.value)}
            placeholder="Delete"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              disabled={check !== "Delete"}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeletePariod;
