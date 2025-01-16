"use client"
import { useMemo } from "react";
import { ProfileDetailType } from "./types";

export const useProfileComparison = (
  currentFormValues: any,
  ProfileDetail: ProfileDetailType
) => {
  const isProfileUnchanged = useMemo(() => {
    const [currentFirstName, currentLastName] = (
      ProfileDetail?.name || ""
    ).split(" ");

    const originalValues = {
      firstName: currentFirstName || "",
      lastName: currentLastName || "",
      prefix: ProfileDetail?.prefix?.prefix_id || "",
      email: ProfileDetail?.email || "",
      role: ProfileDetail?.role?.id || "",
      phoneNumber: ProfileDetail?.phone || "ไม่พบเบอร์โทร",
      image: ProfileDetail?.image?.url,
      department: ProfileDetail?.department?.id || "",
    };

    // เพิ่ม debug logs
    // console.log("originalValues",originalValues);
    // console.log("currentFormValues",currentFormValues);


    return Object.keys(originalValues).every((key) => {
      // ถ้าเป็น image หรือ department และค่าใน form เป็น undefined ให้ถือว่าไม่มีการเปลี่ยนแปลง
      if ((key === 'image' || key === 'department') && currentFormValues[key] === undefined) {
        return true;
      }

      const originalValue = originalValues[key as keyof typeof originalValues];
      const currentValue = currentFormValues[key];

      // ถ้าทั้งคู่เป็น empty string ให้ถือว่าเท่ากัน
      if (originalValue === "" && currentValue === "") return true;

      // เปรียบเทียบค่าปกติ
      return originalValue === currentValue;
    });
  }, [currentFormValues, ProfileDetail]);

  return isProfileUnchanged;
};