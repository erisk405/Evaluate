"use client";
import React, { useEffect, useState } from "react";
import MyEvaluated from "./_components/MyEvaluated";
import RightSection from "./_components/RightSection";
import GlobalApi from "@/app/_unit/GlobalApi";
import ReportOverview from "./_components/ReportOverview";
const page = () => {
  const [checkPermission, setCheckPermission] = useState(); // ใช้ในการcheckว่า คนนี้เป็น admin หรือ user เพื่อใช้ในการแสดงInterface ต่างๆ
  const fetchProtected = async () => {
    try {
      const response = await GlobalApi.fetchProtected();
      console.log(response?.data?.role);

      setCheckPermission(response?.data?.role);
    } catch (error) {
      console.error({ message: error });
    }
  };

  useEffect(() => {
    fetchProtected();
  }, []);
  return (
    <div className="m-5 grid grid-cols-6 gap-5 w-full">
      <div className="xl:col-span-4 col-span-6 w-full">
        {checkPermission && checkPermission !== "admin" ? (
          <MyEvaluated />
        ) : (
          <ReportOverview />
        )}
      </div>
      <div className="xl:col-span-2 col-span-6 w-full">
        <RightSection permission={checkPermission} />
      </div>
    </div>
  );
};

export default page;
