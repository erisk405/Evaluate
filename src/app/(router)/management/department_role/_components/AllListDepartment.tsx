import React, { useEffect, useState } from "react";
import Image from "next/image";
import SettingSection from "./SettingSection";
import useStore from "@/app/store/store";

const AllListDepartment = () => {
  const { departments } = useStore();
  useEffect(() => {
    // console.log(departments);
  }, [departments]);
  return (
    <div className="w-full flex flex-col gap-3 my-4 ">
      {departments.length > 0
        ? departments?.map((item) => (
            <div
              key={item?.id}
              className="border-b p-4 rounded-xl flex items-center gap-3 "
            >
              <div className="w-[250px]">
                <Image
                  src={item?.image ? item?.image.url : "/test.png"}
                  width={300}
                  height={200}
                  alt="banner"
                  className="w-full h-[120px] object-cover rounded-lg"
                />
              </div>
              <div className="flex justify-between w-full items-center">
                <div className="ml-3">
                  <h2 className="text-lg">{item?.department_name}</h2>
                  <h2 className="text-gray-500">{item?._count?.user} คน</h2>
                </div>
                <div className="">
                  <SettingSection department={item}  />
                </div>
              </div>
            </div>
          ))
        : [1, 2, 3].map((item,index) => (
            <div key={"LoadDepert"+index} className="flex gap-3 justify-between items-center animate-pulse mt-3 mx-3">
              <div className="flex gap-3 items-center">
                <div className="w-[190px] h-[120px] bg-gray-300 rounded-lg"></div>
                <div className="flex flex-col gap-3">
                  <div className="w-[200px] h-[10px] bg-gray-300 rounded-lg"></div>
                  <div className="w-[300px] h-[10px] bg-gray-300 rounded-lg"></div>
                </div>
              </div>
              <div className="w-[100px] h-[40px] bg-gray-300 rounded-xl"></div>
            </div>
          ))}
    </div>
  );
};

export default AllListDepartment;
