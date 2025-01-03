"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";
import { getResultEvalEachDepartmentType } from "@/types/interface";
import Image from "next/image";
import { Building2, CircleOff, UserRoundCheck, UserRoundX } from "lucide-react";
import useStore from "@/app/store/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useThemeStyles } from "@/hooks/useTheme";
// Correctly typed variants
const variants: Variants = {
  default: {
    width: 32,
    height: 32,
  },
  contact: {
    width: 300,
    height: 100,
    borderRadius: 10,
  },
};

export const CursorContent = ({
  item,
}: {
  item: getResultEvalEachDepartmentType;
}) => {
  const styles = useThemeStyles();
  return (
    <div
      className={`p-2 shadow-lg rounded-lg
        ${styles.background_dark_gradient} `}
    >
      <div className="flex items-center gap-2 ">
        <Image
          src={item.image.url || "/test.png"}
          width={50}
          height={50}
          alt="hover profile"
          className="rounded-lg w-[50px] h-[50px] object-cover"
        />
        <div>
          <p className="font-bold text-sm">{item.department}</p>
          <p
            className={`text-xs ${styles.text_description}`}
          >
            Completed: {item.totalFinished}/{item.totalUsers}
          </p>
        </div>
      </div>

      <hr className="my-1" />
      <div className="pl-6">
        <p
          className={`font-bold ${styles.text_description} text-sm`}
        >
          กำกับดูแลโดย
        </p>
        <div className="grid grid-cols-5 items-center gap-2">
          {item.supervise ? (
            <Image
              src={
                item.supervise?.user?.image
                  ? item.supervise?.user?.image.url
                  : "/profiletest.jpg"
              }
              width={25}
              height={25}
              alt="hover profile"
              className="rounded-full w-[25px] h-[25px] object-cover mx-auto"
            />
          ) : (
            <CircleOff size={18} className="mx-auto" />
          )}
          <p className="text-sm col-span-4">
            {item.supervise?.user?.name
              ? item.supervise?.user?.name
              : "ไม่มีบุคคลที่กำกับดูแลอยู่"}
          </p>
        </div>
        <div className="grid grid-cols-5 mt-1 items-center gap-2">
          <Building2 size={18} className="mx-auto" />
          <p className="text-sm col-span-4">
            {item.supervise?.user?.department?.department_name ||
              "ไม่มีบุคคลที่กำกับดูแลอยู่"}
          </p>
        </div>
      </div>
    </div>
  );
};
const InfoOfDepartmentEval = () => {
  const [cursorText, setCursorText] = useState<React.ReactNode>("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "contact">(
    "default"
  );
  const styles = useThemeStyles();
  const { resultEvalEachDepartment } = useStore();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothCursorX = useSpring(cursorX, springConfig);
  const smoothCursorY = useSpring(cursorY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    cursorX.set(event.clientX + 26);
    cursorY.set(event.clientY + 26);
  };
  const setCursorBlock = (item: getResultEvalEachDepartmentType) => {
    setCursorVariant("contact");
    setCursorText(<CursorContent item={item} />);
  };
  const contactLeave = () => {
    setCursorText("");
    setCursorVariant("default");
  };
  const renderDepartmentHoverInfo = (
    item: getResultEvalEachDepartmentType,
    index: number
  ) => {
    return (
      <div
        key={index + "Go"}
        onMouseEnter={() => setCursorBlock(item)} // ส่งข้อมูล `item` เข้าไป
        onMouseLeave={contactLeave}
        className={`w-full hover:scale-95 active:scale-90 grid grid-cols-12 
          shadow overflow-hidden rounded-xl transition-transform 
          ${styles.background}`}
      >
        <div className="w-full h-[160px] col-span-5">
          <Image
            width={300}
            height={300}
            alt="bannerDepartment"
            src={item?.image.url ? item?.image.url : "/test.png"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-1 col-span-7">
          <div className="p-3 flex flex-col col-span-1 lg:col-span-3 justify-between ">
            <div className="flex items-center gap-3">
              <div className="p-2 border rounded-full ">
                <Building2 size={18} />
              </div>
              <h2 className="text-sm">{item.department}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 border rounded-full ">
                <UserRoundCheck size={18} />
              </div>
              <div className="grid grid-cols-1">
                <h2 className="font-bold">
                  {item.totalFinished}/{item.totalUsers}
                </h2>
                <h2 className="text-sm">เสร็จสิ้นแล้วทั้งหมด</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 border rounded-full ">
                <UserRoundX size={18} />
              </div>
              <div className="grid grid-cols-1">
                <h2 className="font-bold">{item.totalUnfinished}</h2>
                <h2 className="text-sm">ยังไม่เสร็จ</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div
      className="grid grid-cols-1  @[650px]:grid-cols-2 @[950px]:grid-cols-3 gap-3"
      onMouseMove={handleMouseMove}
    >
      {resultEvalEachDepartment?.map((item, index) => (
        <Dialog key={item.id}>
          <DialogTrigger asChild>
            {renderDepartmentHoverInfo(item, index)}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>ข้อมูลสมาชิกภายในหน่วยงาน</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[458px]">
              {item.unfinishUsers?.map((item) => (
                <div
                  className="grid grid-cols-4 items-center gap-4 px-5 py-2"
                  key={item.id}
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <Image
                      src={(item.image && item.image.url) || "/profiletest.jpg"}
                      width={50}
                      height={50}
                      className="rounded-lg w-[50px] h-[50px] object-cover "
                      alt="unfinishProfile"
                    />
                    <div className="text-sm">
                      <h2>{item.name}</h2>
                      <p className="text-gray-500">{item.role.role_name}</p>
                    </div>
                  </div>
                  <div className="col-span-1 text-sm">ยังประเมินไม่ครบ</div>
                </div>
              ))}
            </ScrollArea>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      {/* Your mapped content here */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: smoothCursorX,
          y: smoothCursorY,
          pointerEvents: "none",
          zIndex: 9999,
        }}
        variants={variants}
        animate={cursorVariant} // This now works
        transition={{ type: "tween", ease: "backOut" }}
      >
        {cursorText}
      </motion.div>
    </div>
  );
};

export default InfoOfDepartmentEval;
