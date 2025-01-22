"use client";
import React, { useEffect, useState } from "react";
import { ListEmployee } from "./_components/ListAllUser";
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { User } from "@/types/interface";
import { useThemeStyles } from "@/hooks/useTheme";

const page = () => {
  const { setRole, setDepartments } = useStore();
  const styles = useThemeStyles();
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      // console.log("role:", response);
      setRole(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartment();
      setDepartments(response?.data); // ตั้งค่าเป็นอาเรย์ว่างถ้าไม่มีข้อมูล
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };
  const [allUser, setAllUser] = useState<User[]>([]);
  const fetchUserList = async () => {
    try {
      const response = await GlobalApi.getAllUsers();
      console.log("AllUser", response?.data);
      setAllUser(response?.data);
    } catch (error) {
      console.error({ message: error });
      handleErrorOnAxios(error);
    }
  };

  const OptionEmployee = [
    {
      id: "OEP01",
      name: "สมาชิกทั้งหมด",
      quantity: allUser.length,
      color: "from-red-300 to-pink-300",
    },
    {
      id: "OEP02",
      name: "ยังไม่ระบุตำแหน่งงาน",
      quantity: allUser.filter((fil) => fil.role?.role_name === "member")
        .length,
      color: "from-green-200 to-emerald-300",
    },
    {
      id: "OEP03",
      name: "ยังไม่ระบุหน่วยงาน",
      quantity: allUser.filter(
        (fil) => !fil.department && fil.role?.role_name !== "admin"
      ).length,
      color: "from-blue-300 to-cyan-300",
    },
    {
      id: "OEP04",
      name: "ยังไม่ถูกเพิ่มรูปโปรไฟล์",
      quantity: allUser.filter((fil) => !fil.image).length,
      color: "from-purple-300 to-fuchsia-300",
    },
  ];
  useEffect(() => {
    fetchRole();
    fetchUserList();
    getDepartment();
  }, []);
  return (
    <div className={`p-4 w-full grid grid-cols-1 ${styles.text}`}>
      <div className="">
        <h2 className="text-3xl font-bold">
          🛠️ รายชื่อผู้ใช้งานทั้งหมด{" "}
          <span className="animate-wiggle-float"></span>
        </h2>
        <div className="flex justify-between flex-wrap gap-3 my-10 rounded-3xl">
          {OptionEmployee.map((item) => (
            <div key={item?.id} className="w-[290px] cursor-pointer">
              <div
                className={`flex rounded-3xl gap-3 relative overflow-hidden
              items-center shadow-lg shadow-orange-500/50 h-auto bg-gradient-to-br from-orange-500 from-30% to-amber-500 to-70% 
              transition-all `}
              >
                <div className="text-white flex flex-col justify-between gap-8 h-full w-full p-5 z-10">
                  <div className="">
                    <h2 className="text-xl">{item?.name}</h2>
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl">
                      {item?.quantity} <span className="text-lg">คน</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="">
          <ListEmployee allUser={allUser} fetchUserList={fetchUserList} />
        </div>
      </div>
    </div>
  );
};

export default page;
