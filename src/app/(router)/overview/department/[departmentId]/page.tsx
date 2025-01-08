"use client";
import React, { useEffect, useState } from "react";
import {
  Bolt,
  Check,
  ChevronLeft,
  CirclePlus,
  GraduationCap,
  Hexagon,
  ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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

import { useParams } from "next/navigation";
import { apiUrl } from "@/app/data/data-option";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import { motion } from "framer-motion";
import { UserInDepartment } from "./_components/UserInDepartment";
import { Department, userHaveBeenEvaluatedType } from "@/types/interface";
import axios from "axios";
import EvaluateSheet from "./_components/EvaluateSheet";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";

const page = () => {
  const params = useParams<{ departmentId: string }>();
  const {
    ProfileDetail,
    updateProfileDetail,
    currentlyEvaluationPeriod,
    fetchCurrentPeriod,
  } = useStore();
  const { getThemeClass } = useThemeClass();
  const styles = useThemeStyles();
  const [department, setDepartment] = useState<Department>();
  const [userHaveBeenEvaluated, setUserHaveBeenEvaluated] = useState<
    userHaveBeenEvaluatedType[]
  >([]);

  const joinDepartment = async () => {
    try {
      const response = await GlobalApi.joinDepartment(params.departmentId);
      const {department} = response?.data
      updateProfileDetail({
        department: department ? department : null,
      });
    } catch (error) {
      console.error({message:error});
      
    }
  };

  const fetchUserHaveBeenEvaluated = async () => {
    try {
      if (currentlyEvaluationPeriod) {
        const payload = {
          period_id: currentlyEvaluationPeriod.period_id,
        };
        // console.log("payload",payload);
        const response = await GlobalApi.findUserEvaluated(payload);
        setUserHaveBeenEvaluated(response?.data);
        // console.log("findUserEvaluated", response?.data);
      }
    } catch (error) {
      console.error({ message: error });
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartmentById(params.departmentId);
      const data = response?.data.department_data;
      setDepartment(data);
      // console.log("department", data);
    } catch (error) {
      console.log({ message: error });
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchUserHaveBeenEvaluated();
  }, [currentlyEvaluationPeriod, ProfileDetail]);

  useEffect(() => {
    const initializeFunction = async () => {
      await fetchCurrentPeriod();
    };
    if (!currentlyEvaluationPeriod) {
      initializeFunction();
    }
  }, []);
  return (
    <div className="m-5 w-full flex flex-col gap-3">
      {/* ----------------------------------------------- */}
      {/*                    Header                       */}
      {/* ----------------------------------------------- */}
      {department && (
        <>
          <div className="flex justify-between">
            <Link href={"/overview"} className="flex items-center gap-3 group">
              <div
                className={getThemeClass(
                  {
                    light:
                      "text-neutral-800 group-hover:bg-black group-hover:text-white ",
                    dark: "text-white group-hover:bg-blue-500 group-hover:text-text-white ",
                  },
                  `shadow rounded-lg`
                )}
              >
                <ChevronLeft size={28} />
              </div>
              <span className={`cursor-pointer ${styles.text}`}>
                Back to overview
              </span>
            </Link>
            <div>
              <AlertDialog>
                {department.department_name ? (
                  ProfileDetail.department?.department_name ===
                  department.department_name ? (
                    <h2 className="flex items-center gap-2 py-1 px-2 rounded-lg text-lg font-bold text-emerald-500 bg-emerald-100">
                      <Check />
                      คุณอยู่ในหน่วยงานนี้แล้ว
                    </h2>
                  ) : (
                    <AlertDialogTrigger asChild>
                      <Button className="flex gap-3">
                        <CirclePlus /> Join this department
                      </Button>
                    </AlertDialogTrigger>
                  )
                ) : (
                  <div className="bg-gray-300 w-[200px] h-[40px] rounded-lg animate-pulse"></div>
                )}
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                      คูณแน่ใจที่จะเข้า
                      <span className="underline">
                        {department.department_name}
                      </span>{" "}
                      ใช่หรือไม่ ?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-500 text-lg">
                      หากยืนยัน บันทึกการประเมินทั้งหมดของคุณจะถูกลบทิ้ง
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={joinDepartment}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          {department.department_name ? (
            <div className={`${styles.text}`}>
              <h2 className="font-bold text-4xl">
                {department.department_name}
              </h2>

              {/* ----------------------------------------------- */}
              {/*                 Body List                       */}
              {/* ----------------------------------------------- */}
              <div className="flex justify-around gap-3 flex-wrap p-5 rounded-3xl">
                {/* ใช้ [...(department.user || []), ...(department.supervise?.user
                ? [department.supervise.user] : [])] เพื่อรวม array */}
                {/* กรอง department.user ตามเงื่อนไข LEVEL_2 หรือ LEVEL_4
                เพิ่ม department.supervise?.user เข้าไปถ้ามี */}
                {[
                  ...(department.user?.filter((item) =>
                    ["LEVEL_2", "LEVEL_3", "LEVEL_4"].includes(
                      item.role.role_level
                    )
                  ) || []),
                  ...(department.supervise?.user && //หาก่อนว่าบุคคลนี้มีอยู่ใน department มั้ย ถ้ามีแสดงว่า เป็นหน่วยงานที่ตนเองสังกัด ถ้าไม่มี แสดงว่ามากำกับดูแล
                  !department.user?.some(
                    (u) => u.id === department.supervise?.user?.id
                  )
                    ? [department.supervise.user]
                    : []),
                ].map((item, index) => (
                  <motion.div
                    key={item?.id}
                    className="flex-1 min-w-[250px] max-w-full cursor-pointer "
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      ease: [0, 0.71, 0.2, 1.01],
                      delay: index * 0.2,
                    }}
                  >
                    <div
                      className={getThemeClass(
                        {
                          light:
                            "from-neutral-800 from-20% to-neutral-900 to-50%",
                          dark: "from-blue-950 from-10% to-background_secondary to-50%",
                        },
                        `flex rounded-2xl gap-3 relative overflow-hidden items-center px-8 py-4 shadow-xl 
                        bg-gradient-to-tl group 
                        transition-all `
                      )}
                    >
                      <div className="text-white w-full group-hover:text-white z-10">
                        <div className="flex gap-3">
                          <Image
                            src={"/profiletest.jpg"}
                            width={100}
                            height={100}
                            alt="imageProsiden"
                            className="w-[70px] h-[80px] object-cover rounded-xl"
                          />
                          <div>
                            <h2 className="text-md text-gray-300">
                              {item?.role.role_name}
                            </h2>
                            <h2 className="text-lg">
                              {item.prefix?.prefix_name + item?.name}
                            </h2>
                            <div
                              className="inline-flex items-center gap-2 bg-neutral-800 
              px-4 py-1 rounded-full text-neutral-400"
                            >
                              <GraduationCap size={20} />
                              <h2 className="text-sm">
                                {item?.department?.department_name}
                              </h2>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex w-full justify-end mt-3 ">
                          <EvaluateSheet
                            userHaveBeenEvaluated={userHaveBeenEvaluated}
                            item={item}
                            fetchUserHaveBeenEvaluated={
                              fetchUserHaveBeenEvaluated
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* ----------------------------------------------------------*/}
              {/*                 Employee Indepartment                     */}
              {/* ------------------------------------------------------ -- */}
              <motion.div
                className="xl:col-span-6 col-span-6"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.6,
                  ease: [0, 0.71, 0.2, 1.01],
                  delay: 0.3,
                }}
              >
                {/* ตั้งเงื่อนไขเพื่อไม่ให้เห็นชื่อตัวเองภายในหน่วยงานในตอนที่จะทำการประเมิน */}
                <UserInDepartment
                  member={department.user}
                  userHaveBeenEvaluated={userHaveBeenEvaluated}
                  fetchUserHaveBeenEvaluated={fetchUserHaveBeenEvaluated}
                />
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-3 w-64 bg-gray-400 rounded-full"></div>
              <div className="h-3 w-32 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default page;
