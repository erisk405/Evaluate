"use client";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageType, PeriodType } from "@/types/interface";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const DepartmentSection = () => {
  const { departments, setDepartments } = useStore();
  const getDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartment();
      setDepartments(response?.data); // ตั้งค่าเป็นอาเรย์ว่างถ้าไม่มีข้อมูล
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);
  return (
    <ScrollArea className="h-[ุ650px]">
      <div className="grid gap-3 m-2 xl:grid-cols-1 lg:grid-cols-3">
        {departments.length > 0
          ? departments.map((item) => (
              <Link
                href={`/overview/department/${item.id}`}
                key={item?.id}
                className="overflow-hidden cursor-pointer col-span-1 rounded-2xl shadow
                hover:scale-95 active:scale-90 bg-white group transition-all border"
              >
                <div className="grid grid-cols-5 relative">
                  <Image
                    src={
                      typeof item.image === "string"
                        ? item.image
                        : (item.image as ImageType)?.url || "/test.png"
                    }
                    width={500}
                    height={500}
                    alt="BannerDeapartment"
                    className="col-span-2 w-full h-[120px] shadow object-cover"
                    loading="lazy"
                  />
                  <div className="group-hover:drop-shadow-md col-span-3">
                    <h2 className="text-start p-3">{item?.department_name}</h2>
                  </div>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6].map((item) => (
              <div
                className="flex flex-col gap-3 animate-pulse"
                key={item + "load"}
              >
                <div className="bg-gray-200 h-[120px] rounded-2xl"></div>
                <div className="rounded-2xl h-[10px] bg-gray-200 w-full p-3"></div>
              </div>
            ))}
      </div>
    </ScrollArea>
  );
};

export default DepartmentSection;
