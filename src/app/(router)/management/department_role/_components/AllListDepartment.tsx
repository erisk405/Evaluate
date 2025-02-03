"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SettingSection from "./SettingSection";
import useStore from "@/app/store/store";
import { Department } from "@/types/interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useThemeStyles } from "@/hooks/useTheme";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface AllListDepartmentProps {
  department: Department[];
  fetchDepart: () => void;
}
const AllListDepartment = ({
  department,
  fetchDepart,
}: AllListDepartmentProps) => {
  const { roles } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const showToast = (title: string, description: string) => {
    toast(title, { description });
  };
  const styles = useThemeStyles();
  const handleDeleteDepartment = async (departmemtId: string) => {
    setIsLoading(true);
    try {
      showToast("กำลังดำเนินการ", `ขณะนี้ระบบกำลังดำเนินการ โปรดรอสักครู่...`);
      const response = await GlobalApi.deleteDepartment(departmemtId);
      // console.log("response dept", response?.data);

      if (response && response?.status === 200) {
        showToast(
          "ดำเนินการสำเร็จ",
          `ระบบได้ลบหน่วยงาน "${response?.data?.delete?.department_name}" เรียบร้อยแล้ว`
        );
      }
      await fetchDepart();
      // ปิด AlertDialog หลังจากทำงานเสร็จ
    } catch (error) {
      console.error({ message: error });
      handleErrorOnAxios(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`@container w-full flex flex-col gap-3 my-4 
        sm:max-h-[1080px] rounded-sm p-3 ${styles.background}
        shadow-inner overflow-scroll scrollbar-gemini`}
    >
      {department.length > 0 ? (
        department?.map((item) => (
          <div
            key={item?.id}
            className={`shadow p-4 ${styles.background_card} rounded-lg grid grid-cols-4  items-center gap-3 `}
          >
            <div className="w-full col-span-4 @[568px]:col-span-1">
              <Image
                src={item?.image ? item?.image.url : "/test.png"}
                width={300}
                height={200}
                alt="banner"
                className="w-full h-[150px] object-cover rounded-lg"
              />
            </div>
            <div className="col-span-4 @[568px]:col-span-2 max-w-[468px] w-full mx-auto">
              <h2 className="text-lg">{item?.department_name}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {roles.map(
                  (role) =>
                    role.role_name !== "admin" &&
                    role.role_name !== "member" && (
                      <div
                        key={role.id}
                        className="flex justify-between text-sm"
                      >
                        <h2 className="text-gray-500">{role.role_name}</h2>
                        <h2>
                          {
                            item?.user?.filter(
                              (users) =>
                                users.role?.role_name === role?.role_name
                            ).length
                          }{" "}
                          คน
                        </h2>
                      </div>
                    )
                )}
                <div className="flex justify-between  text-gray-500 text-sm">
                  <h2 className="font-bold">ทั้งหมด</h2>
                  <h2>{item?.user?.length} คน</h2>
                </div>
              </div>
            </div>
            <div className="col-span-4 @[568px]:col-span-1 mx-auto">
              <SettingSection department={item} fetchDepart={fetchDepart} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full mt-3">ลบหน่วยงาน</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>คุณแน่ใจแล้วใช้ไหม?</AlertDialogTitle>
                    <AlertDialogDescription>
                      การนำเนินการนี้จะลบหน่วยงานนี้ออกจากระบบอย่างถาวร
                      หากแน่ใจแล้วกดปุ่ม"ยืนยัน
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteDepartment(item.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "ยืนยัน"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))
      ) : (
        <div className="h-72 flex justify-center items-center gap-3">
          <h2 className="text-3xl">
            ไม่มีหน่วยงานในขณะนี้ โปรดสร้างหน่วยงานก่อน
          </h2>
          <h2 className="text-6xl animate-wiggle-float">🐈</h2>
        </div>
      )}
    </div>
  );
};

export default AllListDepartment;
