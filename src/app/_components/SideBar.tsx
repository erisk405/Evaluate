"use client";
import Image from "next/image";
import React from "react";
import { OptionSideBar } from "@/app/data/data-option";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SideBar = () => {
  const pathUrl = usePathname();
  return (
    <div>
      {/* option */}
      <div className="my-9 mx-2 flex flex-col gap-3">
        {OptionSideBar.map((item) => (
          <Link
            key={item?.id}
            href={item?.path}
            className={`${pathUrl.includes(item?.path) ? "bg-neutral-800 text-white transition-all" : "text-neutral-600"}
            rounded-2xl px-10 py-2`}
          >
            <div className="flex gap-3 items-center">
              {item?.icon}
              <h2 className="text-lg ">{item.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
