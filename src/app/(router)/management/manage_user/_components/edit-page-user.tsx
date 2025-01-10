"use client";
import { Button } from "@/components/ui/button";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import UserProfile from "./UserProfile";
import { User } from "@/types/interface";
import SecuritySection from "./security-section";
enum SideBarEditSection {
  General = "General",
  Security = "Security",
}
interface UserProfileProps {
  userDetail: User;
  refreshData: () => void;
}
const EditPageUser = ({ userDetail, refreshData }: UserProfileProps) => {
  const [sideBarEdit, setSideBarEdit] = useState<SideBarEditSection>(
    SideBarEditSection.General
  );
  const { getThemeClass } = useThemeClass();
  const styles = useThemeStyles();
  const renderSectionContent = () => {
    switch (sideBarEdit) {
      case SideBarEditSection.General:
        return (
          <UserProfile userDetail={userDetail} refreshData={refreshData} />
        );
      case SideBarEditSection.Security:
        return <SecuritySection userDetail={userDetail} />;
      default:
        return <div className="col-span-3 h-[400px] pl-7">Not found page</div>;
    }
  };
  return (
    <div className={`w-full rounded-lg h-full ${styles.text}`}>
      <div className="flex items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <div className="hover:bg-blue-100 text-start hover:text-blue-500 rounded-lg">
              <Button
                variant={"outline"}
                className="w-[80px] flex gap-2 justify-center cursor-pointer items-center"
              >
                <Settings2 strokeWidth={1.25} size={20} />
                <h2>ตั้งค่า</h2>
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[825px]  grid-cols-4">
            <DialogHeader className="col-span-4">
              <DialogTitle className="text-xl">
                แก้ไขข้อมูลของผู้ใช้งาน
              </DialogTitle>
              <DialogDescription className="text-red-500">
                โปรดตรวจสอบให้แน่ใจ เมื่อต้องการแก้ไขข้อมูลส่วนตัวหรือรหัสผ่าน
                อาจจะส่งผลต่อการกระทำอื่นๆ
              </DialogDescription>
            </DialogHeader>
            <Separator className="shrink-0 h-[0.5px] w-full col-span-4 bg-gray-200" />
            <div className="col-span-1 flex flex-col gap-2">
              {Object.values(SideBarEditSection).map((section) => (
                <div
                  key={section}
                  className={getThemeClass(
                    // จัดการสีพื้นหลังตาม theme
                    {
                      light: `${sideBarEdit === section && "bg-zinc-100"}`,
                      dark: `${sideBarEdit === section && "bg-zinc-700"}`,
                    },
                    // classes อื่นๆ ที่ใช้ร่วมกัน
                    `rounded-lg cursor-pointer p-2`
                  )}
                  onClick={() => setSideBarEdit(section)}
                >
                  <h2 className="text-sm">{section}</h2>
                </div>
              ))}
            </div>
            <div className="col-span-3">{renderSectionContent()}</div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EditPageUser;
