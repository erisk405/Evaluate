"use client"
import { useMemo } from "react";
import { ProfileDetailType } from "./types";

export const useProfileComparison = (
  currentFormValues: any, // ค่าปัจจุบันจาก form
  ProfileDetail: ProfileDetailType// ค่าดั้งเดิมจาก API/database
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
      department: ProfileDetail?.department?.id || "" || "Don't have department", // Compare department by id
    };
    // Object.keys() คืน array ของ keys ทั้งหมดใน object
    // .every() เช็คว่าทุก key ผ่านเงื่อนไขที่กำหนดหรือไม่ ถ้าทุกค่าเท่ากัน return true ถ้ามีค่าใดค่าหนึ่งไม่เท่ากัน return false
    // key as keyof typeof originalValues
    return Object.keys(originalValues).every((key) => {
      const originalValue = originalValues[key as keyof typeof originalValues]; //as เป็นการบอก TypeScript ว่า key นี้แน่ๆ ต้องเป็น key ที่มีอยู่ใน originalValues
      const currentValue = currentFormValues[key];
      return originalValue === currentValue;
    });
  }, [currentFormValues, ProfileDetail]);

  return isProfileUnchanged;
};