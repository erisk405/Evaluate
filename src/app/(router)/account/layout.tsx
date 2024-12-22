"use client";
import { CircleUserRound, Fingerprint } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
const option = [
  {
    id: "ED1",
    label: "Edit profile",
    pathName: "general-data",
    icon: <CircleUserRound strokeWidth={1.25} />,
  },
  {
    id: "SC1",
    label: "Security",
    pathName: "security",
    icon: <Fingerprint strokeWidth={1.25} />,
  },
];
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <div className="grid grid-cols-4 w-full bg-neutral-50 shadow-md overflow-hidden rounded-xl h-screen">
      <div className="col-span-1 p-4 border-r bg-white">
        <h2 className="text-xl text-stone-800 font-bold mb-4">Account</h2>
        <p className="text-sm text-gray-500 my-3">How you use options</p>
        {option.map((item, index) => (
          <Link
            href={`/account/${item.pathName}`}
            className={`flex items-center gap-3 p-3 hover:bg-neutral-100 mb-2 rounded-lg ${
              pathSegments.includes(item.pathName) ? "bg-neutral-100" : ""
            }`}
            key={item.id}
          >
            <span>{item.icon}</span>
            <div className="text-sm">{item.label}</div>
          </Link>
        ))}
      </div>
      <div className="col-span-3 p-4">{children}</div>
    </div>
  );
};

export default layout;
