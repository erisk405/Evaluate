"use client"
import { useMemo } from "react";
import { ProfileDetailType } from "./types";
import useStore from "@/app/store/store";

export const useProfileComparison = (
  currentFormValues: any,
  fromAdmin: boolean,
  userDetail?: ProfileDetailType,
) => {
  const { ProfileDetail } = useStore();
  const profileToCompare = fromAdmin ? userDetail : ProfileDetail;

  const isProfileUnchanged = useMemo(() => {
    const [currentFirstName, currentLastName] = (
      profileToCompare?.name || ""
    ).split(" ");

    const originalValues = {
      firstName: currentFirstName || "",
      lastName: currentLastName || "",
      prefix: profileToCompare?.prefix?.prefix_id || "",
      email: profileToCompare?.email || "",
      role: profileToCompare?.role?.id || "",
      phoneNumber: profileToCompare?.phone || "ไม่พบเบอร์โทร",
      image: profileToCompare?.image?.url,
      department: profileToCompare?.department?.id || "",
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
  }, [currentFormValues, ProfileDetail, userDetail, fromAdmin]);

  return isProfileUnchanged;
};