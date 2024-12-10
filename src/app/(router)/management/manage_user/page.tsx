"use client";
import React, { useEffect } from "react";
import { ListEmployee } from "./_components/ListAllUser";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
const OptionEmployee = [
  {
    id: "OEP01",
    name: "สมาชิกทั้งหมด",
    quantity: 100,
    img: "/team.svg",
    color: "from-red-300 to-pink-300",
  },
  {
    id: "OEP02",
    name: "ยังไม่ได้ระบุตำแหน่งงาน",
    quantity: 15,
    img: "/NewEmployee.svg",
    color: "from-green-200 to-emerald-300",
  },
  {
    id: "OEP03",
    name: "ยังไม่ได้ระบุหน่วยงาน",
    quantity: 65,
    img: "/male.svg",
    color: "from-blue-300 to-cyan-300",
  },
  {
    id: "OEP04",
    name: "ยังประเมินไม่ครบ",
    quantity: 20,
    img: "/female.svg",
    color: "from-purple-300 to-fuchsia-300",
  },
];
const page = () => {
  const { setRole, setDepartments } = useStore();
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      console.log("role:", response);
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

  useEffect(() => {
    fetchRole();
    getDepartment();
  }, []);
  return (
    <div className="p-10 w-full grid grid-cols-1">
      <div className="">
        <h2 className="text-2xl font-bold">Employee</h2>
        <div className="flex justify-around gap-6 flex-wrap my-5 bg-gray-100 rounded-3xl">
          {OptionEmployee.map((item) => (
            <div key={item?.id} className="flex-1 cursor-pointer ">
              <div
                className={`flex rounded-3xl gap-3 relative overflow-hidden
              items-center  shadow-xl  h-[170px]
              bg-gradient-to-br bg-neutral-900 from-neutral-800 from-30% to-neutral-900 to-70% group 
              transition-all `}
              >
                <div className="text-white flex flex-col justify-between h-full w-full p-5 group-hover:text-white z-10">
                  <div className="">
                    <h2 className="text-xl">{item?.name}</h2>
                  </div>
                  <div className="text-right">
                    <h2 className="text-5xl">
                      {item?.quantity} <span className="text-lg">คน</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white shadow p-4 rounded-3xl">
          <h2 className="text-xl font-semibold">All Employee List</h2>
          <p className="text-gray-500">
            The request is in the state Waiting for success
          </p>
          <ListEmployee />
        </div>
      </div>
    </div>
  );
};

export default page;
