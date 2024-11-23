"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { OptionSideBar } from "@/app/data/data-option";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalApi from "../_unit/GlobalApi";
const SideBar = () => {
  const [position, setPosition] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // สถานะของ admin
  const pathUrl = usePathname();
  const Protected = async () => {
    try {
      const response = await GlobalApi.fetchProtected();
      if (response.data.role === "admin") {
        setIsAdmin(true); // ถ้า role เป็น admin ให้ตั้งค่าเป็น true
      }
    } catch (error) {
      // console.error("Error fetching admin role:", error);
      setIsAdmin(false); // ในกรณีที่ดึงข้อมูลไม่สำเร็จ หรือตรวจสอบ role ไม่ผ่าน
    }
  };
  useEffect(() => {
    Protected();
  }, []);

  return (
    <div className="sticky top-32 z-50">
      {/* option */}
      <div className="my-9 mx-2 flex flex-col gap-3 w-auto">
        {OptionSideBar.map((item) =>
          item?.session !== "admin" ? (
            <Link
              key={item?.id}
              href={item?.path}
              className={`${
                pathUrl.includes(item?.path)
                  ? "bg-stone-800 text-white transition-all"
                  : "text-stone-600 hover:bg-gray-100"
              }
               ${isAdmin ? "" : "pr-20"}
              rounded-2xl px-4 py-2 relative group`}
            >
              <div className="flex gap-3 items-center ">
                {item?.icon}
                <h2 className="text-lg hidden md:block">{item.name}</h2>
              </div>
              <div className="block md:hidden">
                <div className="absolute md:block z-50 ease-in-out bg-stone-800 text-white transition-all translate-x-full right-1/4 group-hover:-right-1 group-hover:visible invisible top-1/2 px-2 py-1 rounded-sm -translate-y-1/2">
                  <h2 className="text-sm">{item.name}</h2>
                </div>
              </div>
            </Link>
          ) : (
            isAdmin && (
              <div key={item.id}>
                <div className="block md:hidden relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-none bg-neutral-50 relative group"
                      >
                        {item?.icon}
                        <div className="block md:hidden">
                          <div className="absolute md:block z-50 ease-in-out bg-stone-800 text-white transition-all translate-x-full right-1/4 group-hover:-right-1 group-hover:visible invisible top-1/2 px-2 py-1 rounded-sm -translate-y-1/2">
                            <h2 className="text-sm">{item.name}</h2>
                          </div>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>
                        {item.name === "OSideAdmin" ? "Department" : "Evaluate"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={position}
                        onValueChange={setPosition}
                      >
                        {item?.SubOptionSideBar?.map((item) => (
                          <Link href={item?.path} key={item.id}>
                            <DropdownMenuRadioItem value={item?.name}>
                              {item?.name}
                            </DropdownMenuRadioItem>
                          </Link>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <details
                  key={item?.id}
                  className="group [&_summary::-webkit-details-marker]:hidden hidden md:block"
                >
                  <summary className="group flex gap-3 items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700">
                    <div className="flex items-center justify-between gap-3">
                      {/* icon mangement */}
                      {item?.icon}
                      <span className="text-lg "> {item?.name} </span>
                    </div>
                    <span className="transition duration-300 group-open:-rotate-180 ">
                      <ChevronDown />
                    </span>
                  </summary>
                  <ul className="mt-2 space-y-1 px-4  ">
                    {item?.SubOptionSideBar?.map((item) => (
                      <li key={item?.id}>
                        <Link
                          href={item?.path}
                          className={`block rounded-lg px-4 
                        py-2 text-sm font-medium 
                        ${
                          pathUrl.includes(item?.path)
                            ? "bg-stone-800 text-white transition-all"
                            : "text-stone-600 hover:bg-gray-100  "
                        }`}
                        >
                          {item?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default SideBar;
