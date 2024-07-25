"use client";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Myprofile from "./Myprofile";
import GlobalApi from "../_unit/GlobalApi";
import useStore from "../store/store";

const Header = () => {
  const { ProfileDetail , updateProfileDetail } = useStore();

  const handleLogout = async () => {
    try {
      const response = await GlobalApi.Logout();
      console.log(response);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const fetchUser = async () => {
    try {
      const response = await GlobalApi.fetchUserProfile(); // Await the promise
      const name = response.data.name;
      const image = response.data.image?.url;
      const email = response.data?.email;
      updateProfileDetail(name,email,image ? image : '/profiletest.jpg');
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="flex relative justify-between items-center py-2">
      <div className="flex-1 flex items-center min-w-[200px] max-w-[1000px] gap-20">
        {/* logo */}
        <div className="flex items-center py-1">
          <Image src={'/logo.png'} alt="logo" width={76} height={76} />
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
        <div className="flex gap-1">
          {/* When click image profile */}
          <Dialog>
            <DialogTrigger asChild>
              {ProfileDetail.image ? 
              <Image
                src={ProfileDetail.image}
                alt="logo"
                width={45}
                height={45}
                className="w-[45px] h-[45px] object-cover rounded-full cursor-pointer"
              />
              :
              <Image
                src={'/profiletest.jpg'}
                alt="logo"
                width={45}
                height={45}
                className="w-[45px] h-[45px] object-cover rounded-full cursor-pointer"
              />
            }
              
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogContent className="sm:max-w-[600px] p-1 sm:rounded-2xl overflow-hidden">
              <div className="">
                <Myprofile/>
              </div>
            </DialogContent>
          </Dialog>
          {/* DropDown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-1">
                {ProfileDetail.name ? 
                  ProfileDetail.name 
                : 
                  <div className="flex flex-col gap-1">
                    <div className="w-[150px] h-3 rounded-full bg-neutral-300 animate"></div>
                    <div className="w-[100px] h-3 rounded-full bg-neutral-300 animate"></div>
                  </div>
                }
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <Link href={"/sign-in"} onClick={handleLogout}>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
