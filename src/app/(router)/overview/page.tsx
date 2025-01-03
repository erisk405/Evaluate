"use client";
import React, { useEffect, useState } from "react";
import MyEvaluated from "./_components/MyEvaluated";
import RightSection from "./_components/RightSection";
import GlobalApi from "@/app/_util/GlobalApi";
import ReportOverview from "./_components/ReportOverview";
import Loading from "@/app/_components/Loading";
import useStore from "@/app/store/store";
const page = () => {
  const [checkPermission, setCheckPermission] = useState(null); // ใช้ในการcheckว่า คนนี้เป็น admin หรือ user เพื่อใช้ในการแสดงInterface ต่างๆ
  const { fetchCurrentPeriod, allPeriod } = useStore();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await GlobalApi.fetchProtected();
        // console.log(response?.data?.role);

        setCheckPermission(response?.data?.role);
      } catch (error) {
        console.error({ message: error });
      }
    };
    fetchProtected();
    const initializePeriod = async () => {
      try {
        await fetchCurrentPeriod();
      } catch (error) {
        // Handle error (e.g., show error message)
      }
    };
    initializePeriod();
  }, []);

  useEffect(()=>{
    console.log("allPeriod",allPeriod);
    
  },[allPeriod])
  if (checkPermission === null) {
    return <Loading />;
  }

  if (checkPermission === "error") {
    return <div>Error fetching permission data.</div>;
  }
  return (
    <div className="m-5 grid grid-cols-11 gap-3 w-full">
      <div className="xl:col-span-8 col-span-11 w-full">
        {checkPermission && checkPermission !== "admin" ? (
          <MyEvaluated />
        ) : (
          <ReportOverview />
        )}
      </div>
      <div className="xl:col-span-3 col-span-11 w-full">
        <RightSection
          permission={checkPermission}
          period={allPeriod ? allPeriod : []}
        />
      </div>
    </div>
  );
};

export default page;
