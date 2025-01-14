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

interface AllListDepartmentProps {
  department: Department[];
  fetchDepart: () => void;
}
const AllListDepartment = ({
  department,
  fetchDepart,
}: AllListDepartmentProps) => {
  const { roles } = useStore();
  const styles = useThemeStyles()
  return (
    <div className="@container w-full flex flex-col gap-3 my-4 sm:max-h-[700px] overflow-scroll scrollbar-gemini">
      {department.length > 0
        ? department?.map((item) => (
            <div
              key={item?.id}
              className="border-b p-4 rounded-xl grid grid-cols-4  items-center gap-3 "
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
                                  users.role.role_name === role.role_name
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
                    <Button className="w-full mt-3">
                      ลบหน่วยงาน
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        : [1, 2, 3].map(
            (
              item,
              index // for loading when wait api send response
            ) => (
              <div
                key={"LoadDepert" + index}
                className="flex gap-3 justify-between items-center animate-pulse mt-3 mx-3"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-[190px] h-[120px] bg-zinc-400 rounded-lg"></div>
                  <div className="flex flex-col gap-3">
                    <div className="w-[200px] h-[10px] bg-zinc-400 rounded-lg"></div>
                    <div className="w-[300px] h-[10px] bg-zinc-400 rounded-lg"></div>
                  </div>
                </div>
                <div className="w-[100px] h-[40px] bg-zinc-400 rounded-xl"></div>
              </div>
            )
          )}
    </div>
  );
};

export default AllListDepartment;
