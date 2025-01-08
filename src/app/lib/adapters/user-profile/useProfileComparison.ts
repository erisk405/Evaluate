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
      prefix: ProfileDetail?.prefix?.prefix_id || undefined,
      email: ProfileDetail?.email || "",
      role: ProfileDetail?.role?.id || "",
      phoneNumber: ProfileDetail?.phone || "ไม่พบเบอร์โทร",
      image: ProfileDetail?.image?.url,
      department: ProfileDetail?.department?.id || "" || "Don't have department", // Compare department by id
    };
    // console.log("originalValues",originalValues);
    // console.log("currentFormValues",currentFormValues);
    
    // Object.keys() คืน array ของ keys ทั้งหมดใน object
    // .every() เช็คว่าทุก key ผ่านเงื่อนไขที่กำหนดหรือไม่ ถ้าทุกค่าเท่ากัน return true ถ้ามีค่าใดค่าหนึ่งไม่เท่ากัน return false
    // key as keyof typeof originalValues
    return Object.keys(originalValues).every((key) => {
      // ถ้าเป็น image และค่าใน form เป็น undefined ให้ถือว่าไม่มีการเปลี่ยนแปลง
      if (key === 'image'  && currentFormValues[key] === undefined) {
        return true;
      }
      // ถ้าเป็น department และค่าใน form เป็น undefined ให้ถือว่าไม่มีการเปลี่ยนแปลง
      if (key === 'department'  && currentFormValues[key] === undefined) {
        return true;
      }
      const originalValue = originalValues[key as keyof typeof originalValues]; //as เป็นการบอก TypeScript ว่า key นี้แน่ๆ ต้องเป็น key ที่มีอยู่ใน originalValues
      const currentValue = currentFormValues[key];
      
      // เปรียบเทียบค่าอื่นๆ ตามปกติ
      return originalValue === currentValue;
    });
  }, [currentFormValues, ProfileDetail]);

  return isProfileUnchanged;
};