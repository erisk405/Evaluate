"use client";
import useStore from "@/app/store/store";
import { Separator } from "@/components/ui/separator";
import { useThemeClass, useThemeStyles } from "@/hooks/useTheme";
import Image from "next/image";
import React from "react";

const InfomationProfile = () => {
  const { ProfileDetail } = useStore();

  const { getThemeClass } = useThemeClass();
  return (
    <div className={`p-3 `}>
      <div className="relative h-32 shadow rounded-xl">
        <Image
          src={"/bannerInfo.jpg"}
          width={800}
          height={800}
          className="absolute top-0 bottom-0 left-0 right-0 w-full h-full object-cover z-20 rounded-xl"
          alt="BannerInfo"
        />
        <Image
          src={ProfileDetail.image ? ProfileDetail.image : "/profiletest.jpg"}
          width={100}
          height={100}
          className="absolute left-3 -bottom-1/2 -translate-y-1/2 rounded-full w-[60px] h-[60px] object-cover z-50 border-2"
          alt="Info Profile"
        />
      </div>
      <div className="mt-10">
        <h2>
          <span>{ProfileDetail.prefix?.prefix_name}</span>
          {ProfileDetail.name}
        </h2>
        <p className="text-sm text-gray-500">{ProfileDetail.role?.role_name}</p>
        <div
          className={getThemeClass(
            {
              light: "bg-neutral-100",
              dark: "bg-neutral-950",
            },
            `rounded-xl p-3`
          )}
        >
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neutral-300  text-xl rounded-full">🏬</span>
            <div className="grid grid-cols-1 leading-4">
              <p className="text-sm text-gray-500">สังกัดอยู่ที่</p>
              <h2 className="text-sm">
                {ProfileDetail.department?.department_name}
              </h2>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neutral-300  text-xl rounded-full">📧</span>
            <div className="grid grid-cols-1 leading-4">
              <p className="text-sm text-gray-500">สังกัดอยู่ที่</p>
              <h2 className="text-sm">{ProfileDetail.email}</h2>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-2">
            <span className="p-1 bg-neutral-300  text-xl rounded-full">📱</span>
            <div className="grid grid-cols-1 leading-4">
              <p className="text-sm text-gray-500">สังกัดอยู่ที่</p>
              <h2 className="text-sm">0906652652</h2>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 my-3">
          <div className="shadow rounded-lg px-2 py-1">
            <p className="text-sm text-gray-500">จิตพิสัย</p>
            <h2 className="text-md text-end">4.20</h2>
          </div>
          <div className="shadow rounded-lg px-2 py-1">
            <p className="text-sm text-gray-500">ทักษะ</p>
            <h2 className="text-md text-end">4.20</h2>
          </div>
          <div className="shadow rounded-lg px-2 py-1">
            <p className="text-sm text-gray-500">ความรู้</p>
            <h2 className="text-md text-end">4.20</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfomationProfile;
