"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Check,
  ChevronLeft,
  CirclePlus,
  GraduationCap,
  Hexagon,
  ListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useParams } from "next/navigation";
import axios from "axios";
import { apiUrl } from "@/app/data/data-option";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import { motion } from "framer-motion";
import { UserInDepartment } from "./_components/UserInDepartment";
import { Department } from "@/types/interface";

const data: employee[] = [
  {
    id: "m5gr84i9",
    name: "amphon yyyy",
    status: "success",
    email: "ken99@yahoo.com",
    role: "CEO",
    phone: "095-454-4484",
    department: "CompanyA",
    img: "/profiletest.jpg",
  },
  {
    id: "3u1reuv4",
    name: "Krittaphat samrit",
    status: "success",
    email: "Abe45@gmail.com",
    role: "เสาหลัก",
    phone: "095-454-4484",
    department: "CompanyB",
    img: "/profiletest.jpg",
  },
  {
    id: "derv1ws0",
    name: "Panyakorn somawong",
    status: "processing",
    email: "Monserrat44@gmail.com",
    role: "Head",
    phone: "095-454-4484",
    department: "CompanyB",
    img: "/profiletest.jpg",
  },
  {
    id: "5kma53ae",
    name: "Wichaphon dogcat",
    status: "success",
    email: "Silas22@gmail.com",
    role: "COO",
    phone: "095-454-4484",
    department: "CompanyB",
    img: "/profiletest.jpg",
  },
  {
    id: "bhqecj4p",
    name: "Worakamon gogo",
    status: "failed",
    email: "carmella@hotmail.com",
    role: "CPE",
    phone: "095-454-4484",
    department: "CompanyC",
    img: "/profiletest.jpg",
  },
  {
    id: "bhqecj4p1215",
    name: "catcat gogo",
    status: "failed",
    email: "carmella2@hotmail.com",
    role: "CPE",
    phone: "095-454-4484",
    department: "CompanyC",
    img: "/profiletest.jpg",
  },
];

export type employee = {
  id: string;
  name: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  role: string;
  phone: string;
  department: string;
  img: string;
};

const OptionEmployee = [
  {
    id: "OEP01",
    title: "รองผู้อำนวยการ",
    name: "นายกฤตภาส สัมฤทธิ์",
    role: "รองผู้อำนวยการ",
    quantity: 0,
    img: "/team.svg",
    color: "from-red-300 to-pink-300",
  },
  {
    id: "OEP02",
    title: "หัวหน้างานทะเบียน",
    name: "cat cat",
    role: "หัวหน้างานวิชาการ",
    quantity: 0,
    img: "/NewEmployee.svg",
    color: "from-green-200 to-emerald-300",
  },
  {
    id: "OEP03",
    title: "สมาชิกใหม่",
    name: "dog dog",
    role: "Gogo",
    quantity: 65,
    img: "/male.svg",
    color: "from-blue-300 to-cyan-300",
  },
];
const page = () => {
  const params = useParams<{ departmentId: string }>();
  const { ProfileDetail, updateProfileDetail } = useStore();
  const [department, setDepartment] = useState<Department>();

  const joinDepartment = async () => {
    const response = await axios.put(`${apiUrl}/usersDepartment`, params, {
      withCredentials: true,
    });
    const { department } = response.data;
    updateProfileDetail({
      department: department ? department.department_name : null,
    });
  };

  const fetchDepartment = async () => {
    const response = await GlobalApi.getDepartmentById(params.departmentId);
    const data = response?.data.department_data;
    console.log(data);
    setDepartment(data);
  };
  useEffect(() => {
    fetchDepartment();
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
              <div className="bg-white shadow rounded-lg group-hover:bg-black group-hover:text-white">
                <ChevronLeft size={28} />
              </div>
              <span className="cursor-pointer">Back to overview</span>
            </Link>
            <div>
              <AlertDialog>
                {department.department_name ? (
                  ProfileDetail.department === department.department_name ? (
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
                      <span className="underline">{department.department_name}</span>{" "}
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
            <div>
              <h2 className="font-bold text-4xl">{department.department_name}</h2>

              {/* ----------------------------------------------- */}
              {/*                 Body List                       */}
              {/* ----------------------------------------------- */}
              <div className="flex justify-around gap-3 flex-wrap p-5 rounded-3xl">
                {OptionEmployee.map((item, index) => (
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
                      className={`flex rounded-2xl gap-3 relative overflow-hidden
                items-center px-8 py-4 shadow-xl 
                bg-gradient-to-tl from-neutral-800 from-20% to-neutral-900 to-50%  group 
                transition-all `}
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
                              {item?.role}
                            </h2>
                            <h2 className="text-lg">{item?.name}</h2>
                            <div
                              className="inline-flex items-center gap-2 bg-neutral-800 
                      px-4 py-1 rounded-full text-neutral-400"
                            >
                              <GraduationCap size={20} />
                              <h2 className="text-sm">หน่วยงานวิชาการ</h2>
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex w-full justify-end mt-3 ">
                          <h2
                            className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 
                    text-neutral-200 px-2 py-1 rounded-xl transition-all active:scale-95"
                          >
                            <Hexagon /> ประเมิน
                          </h2>
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
                <UserInDepartment member={department.user} />
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
