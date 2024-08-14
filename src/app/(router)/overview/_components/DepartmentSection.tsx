"use client";
import GlobalApi from "@/app/_unit/GlobalApi";
import useStore from "@/app/store/store";
import { Department } from "@/types/interface";
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
        <h2 className="px-5 pt-5 text-xl font-bold">Department</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 m-4">
          {departments.length > 0
            ? departments.map((item) => (
                <Link
                  href={`/overview/department/${item.id}`}
                  key={item?.id}
                  className="overflow-hidden cursor-pointer col-span-1 rounded-2xl shadow-md
            hover:bg-neutral-700 hover:scale-105 active:scale-95 group transition-all"
                >
                  <div className="flex items-center flex-col">
                    {item.image ? (
                      <Image
                        src={item?.image ? item?.image.url: '/test.png'}
                        width={500}
                        height={500}
                        alt="BannerDeapartment"
                        className="w-[250px] h-[120px] object-cover"
                      />
                    ) : (
                      <Image
                        src={"/test.png"}
                        width={500}
                        height={500}
                        alt="BannerDeapartment"
                        className="w-[250px] h-[120px] object-cover"
                      />
                    )}

                    <h2 className="group-hover:text-white text-center p-4">
                      {item?.department_name}
                    </h2>
                  </div>
                </Link>
              ))
            : [1, 2, 3, 4, 5, 6].map((item) => (
                <div className="flex flex-col gap-3 animate-pulse" key={item+"load"}>
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
