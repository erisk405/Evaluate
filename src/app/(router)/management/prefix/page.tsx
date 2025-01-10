"use client"
import React from "react";
import PrefixTable from "./_components/PrefixTable";
import { useThemeStyles } from "@/hooks/useTheme";

const page = () => {
  const styles = useThemeStyles();
  return (
    <div className="p-4 w-full ">
      <h2 className={`text-2xl font-bold ${styles.text}`}>การจัดการคำนำหน้า</h2>
      <div className={`p-2 rounded-xl`}>
        <div className=" rounded-xl">
          <PrefixTable />
        </div>
      </div>
    </div>
  );
};

export default page;
