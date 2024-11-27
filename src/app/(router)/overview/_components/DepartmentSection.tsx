"use client";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { ImageType } from "@/types/interface";
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
    <>
      <div className="max-h-[550px] overflow-y-scroll scrollbar-gemini">
        <div className="grid gap-5 m-2 xl:grid-cols-1 lg:grid-cols-3">
          {departments.length > 0
            ? departments.map((item) => (
                <Link
                  href={`/overview/department/${item.id}`}
                  key={item?.id}
                  className="overflow-hidden cursor-pointer col-span-1 rounded-2xl shadow
                hover:bg-neutral-700 active:scale-95 group transition-all border"
                >
                  <div className="flex items-center xl:flex-row lg:flex-col ">
                    <Image
                      src={
                        typeof item.image === "string"
                          ? item.image
                          : (item.image as ImageType)?.url || "/test.png"
                      }
                      width={150}
                      height={120}
                      alt="BannerDeapartment"
                      className="min-w-[150px] h-[120px] object-cover"
                      loading="lazy"
                    />

                    <h2 className="group-hover:text-white text-start p-3">
                      {item?.department_name}
                    </h2>
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
      </div>
    </>
  );
};

export default DepartmentSection;
