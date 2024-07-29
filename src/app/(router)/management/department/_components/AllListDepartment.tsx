import React, { useEffect, useState } from "react";
import Image from "next/image";
import SettingSection from "./SettingSection";
import useStore from "@/app/store/store";

const AllListDepartment = () => {
  const { departments } = useStore();
  return (
    <div className="w-full flex flex-col gap-3 my-4">
      {departments?.map((item) => (
        <div
          key={item?.id}
          className="border-b p-4 rounded-xl flex items-center gap-3"
        >
          <div className="w-[250px]">
            <Image
              src={item?.image ? item?.image.url: '/test.png'}
              width={300}
              height={200}
              alt="banner"
              className="w-full h-[100px] object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="ml-3">
              <h2 className="text-lg">{item?.department_name}</h2>
              <h2 className="text-gray-500">{item?._count?.user} คน</h2>
            </div>
            <div>
              <SettingSection />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllListDepartment;
