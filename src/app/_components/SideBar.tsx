"use client";
import Image from "next/image";
import React from "react";
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
const SideBar = () => {
  const [position, setPosition] = React.useState("");
  const pathUrl = usePathname();
  return (
    <div className="sticky top-32">
      {/* option */}
      <div className="my-9 mx-2 flex flex-col gap-3 w-auto">
        {OptionSideBar.map((item) =>
          item?.session !== "Admin" ? (
            <Link
              key={item?.id}
              href={item?.path}
              className={`${
                pathUrl.includes(item?.path)
                  ? "bg-neutral-800 text-white transition-all"
                  : "text-neutral-600 hover:bg-gray-100"
              }
              rounded-2xl px-4 py-2 `}
            >
              <div className="flex gap-3 items-center">
                {item?.icon}
                <h2 className="text-lg hidden md:block">{item.name}</h2>
              </div>
            </Link>
          ) : (
            <div  key={item.id}>
              <div className="block md:hidden ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-none bg-neutral-50"
                    >
                      {item?.icon}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{item.name === 'OSideAdmin' ? 'Department' : 'Evaluate'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={position}
                      onValueChange={setPosition}
                    >
                      {item?.SubOptionSideBar?.map((item) => (
                        <Link href={item?.path} key={item.id} className={` `}>
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
                <summary className="group flex gap-5 items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-gray-700">
                  <div className="flex items-center justify-between gap-3">
                    {/* icon mangement */}
                    {item?.icon}
                    <span className="text-lg ">
                      {" "}
                      {item?.name}{" "}
                    </span>
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
                            ? "bg-neutral-800 text-white transition-all"
                            : "text-neutral-600 hover:bg-gray-100  "
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
        )}
      </div>
    </div>
  );
};

export default SideBar;
