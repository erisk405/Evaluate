import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bolt, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import EvaluateSection from "./EvaluateSection";
import { User, userHaveBeenEvaluatedType } from "@/types/interface";

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
        ) : (
          <Button
            className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 
text-neutral-200 px-2 py-1 rounded-xl transition-all active:scale-95"
            onClick={() => setOpen(true)}
          >
            <Hexagon /> ประเมิน
          </Button>
        )}
      </SheetTrigger>
      {!userHaveBeenEvaluated?.some((u) => u.evaluator.id === item.id) && (
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
            evaluatorUserIdTarget={item.id}
            evaluatorRoleTarget={item.role.id}
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
