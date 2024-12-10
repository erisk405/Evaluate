import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bolt, Hexagon, Lock, ShieldHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import EvaluateSection from "./EvaluateSection";
import { PeriodType, User, userHaveBeenEvaluatedType } from "@/types/interface";
import useStore from "@/app/store/store";

type EvaluateSheetProp = {
  userHaveBeenEvaluated: userHaveBeenEvaluatedType[];
  item: User;
  fetchUserHaveBeenEvaluated: () => void;
};
const EvaluateSheet = ({
  userHaveBeenEvaluated,
  item,
  fetchUserHaveBeenEvaluated,
}: EvaluateSheetProp) => {
  const [open, setOpen] = useState(false);
  const { currentlyEvaluationPeriod, ProfileDetail } = useStore();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {userHaveBeenEvaluated?.some((u) => u.evaluator.id === item.id) ? (
          <div
            className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 
text-green-500 px-2 py-1 rounded-xl transition-all active:scale-95"
          >
            <Bolt /> เสร็จสิ้นแล้ว
          </div>
        ) : item.id === ProfileDetail.id ? (
          <div className="flex items-center gap-3 active:scale-95 transition-all text-blue-500 select-none">
            <ShieldHalf /> ไม่สามารถประเมินตนเองได้
          </div>
        ) : currentlyEvaluationPeriod?.isAction ? (
          <div
            className="flex hover:bg-neutral-700 p-2 rounded-lg items-center gap-3 active:scale-95 transition-all"
            onClick={() => setOpen(true)}
          >
            <Hexagon /> ประเมิน
          </div>
        ) : (
          <div
            className="flex items-center gap-3 active:scale-95 transition-all text-yellow-500 select-none"
            onClick={() => setOpen(true)}
          >
            <Lock size={18} />
            <h2>ยังไม่เปิดใช้งาน</h2>
          </div>
        )}
      </SheetTrigger>
      {!userHaveBeenEvaluated?.some((u) => u.evaluator.id === item.id) &&
        currentlyEvaluationPeriod?.isAction &&
        ProfileDetail.id &&
        item.id !== ProfileDetail.id && (
          <SheetContent
            side="bottom"
            className="h-[calc(100vh-10%)] xl:mx-52 rounded-tr-2xl rounded-tl-2xl overflow-scroll scrollbar-gemini"
          >
            <SheetHeader>
              <SheetTitle className="text-3xl text-center text-stone-700">
                แบบฟอร์มการประเมิน
              </SheetTitle>
            </SheetHeader>
            {/* ------------------------------------------------------- */}
            {/*        Conponent   Question and score input             */}
            {/* ------------------------------------------------------- */}
            <EvaluateSection
              
              evaluatorUserTarget={item}
              fetchUserHaveBeenEvaluated={fetchUserHaveBeenEvaluated}
              setOpen={setOpen}
            />
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetContent>
        )}
    </Sheet>
  );
};

export default EvaluateSheet;
