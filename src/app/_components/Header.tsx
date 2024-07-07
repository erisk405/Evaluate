import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between items-center py-2">
      
      <div className="flex-1 flex items-center min-w-[200px] max-w-[1000px] gap-20">
        {/* logo */}
        <div className="flex items-center py-1">
          <Image src={"/logo.png"} alt="logo" width={76} height={76} />
          <h2 className="text-2xl font-bold">Eval 360</h2>
        </div>

        {/* search bar */}
        <div className="flex-1 relative min-w-[200px] max-w-[700px]">
          <label htmlFor="Search" className="sr-only">
            {" "}
            Search{" "}
          </label>

          <input
            type="text"
            id="Search"
            placeholder="Search for..."
            className="w-full rounded-full outline-none p-5 border border-neutral-300 py-2.5 pe-10 shadow-2xl sm:text-sm"
          />
          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>
      {/* profile */}
      <div className="flex items-center gap-8 ">
        <div className="bg-neutral-100 p-2 rounded-full hover:bg-neutral-200">
          <Bell />
        </div>
        <div className="flex gap-3">
          <Image
            src={"/profiletest.jpg"}
            alt="logo"
            width={45}
            height={45}
            className="w-[45px] h-[45px] object-cover rounded-full cursor-pointer"
          />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-1">
                Krittaphat samrit
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <Link href={'/sign-in'}>
                <DropdownMenuItem>
                    Logout
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
