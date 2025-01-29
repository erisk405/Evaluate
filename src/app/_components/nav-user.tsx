"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  FolderClock,
  LogOut,
  Sparkles,
  PieChart,
  ReplaceAll,
  History,
  BetweenHorizontalEnd,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useStore from "../store/store";
import { useEffect, useState } from "react";
import GlobalApi from "../_util/GlobalApi";
import socket from "@/lib/socket";
import Link from "next/link";
import { ImageType } from "@/types/interface";
import { useAuthState } from "@/hooks/useAuthState";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { showProfile, ProfileDetail, updateProfileDetail, setShowProfile } =
    useStore();
  const { isAdmin } = useAuthState();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      // Additional logout logic like clearing local storage or redirecting
      // console.log("Logout successful and token removed.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  // Transform the image object to match the ImageType structure
  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await GlobalApi.fetchUserProfile();
      const {
        id,
        name,
        image,
        email,
        prefix,
        role,
        roleRequests,
        department,
        phone,
        supervise,
      } = response.data;
      // console.log("responseNev-User", response.data);

      updateProfileDetail({
        id,
        prefix,
        name,
        email,
        image,
        role,
        roleRequests,
        phone,
        department: department || null,
        supervise,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Helper function to safely get image src
  const getImageSrc = (image: string | null | undefined) => {
    return image || "/profiletest.jpg";
  };

  useEffect(() => {
    // Fetch user data on component mount
    fetchUser();
  }, []);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={getImageSrc(ProfileDetail.image?.url)}
                    alt={ProfileDetail.name || "profile"}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {ProfileDetail.name
                      ? ProfileDetail.name.charAt(0).toUpperCase()
                      : "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {ProfileDetail.name}
                  </span>
                  <span className="truncate text-xs">
                    {ProfileDetail.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={getImageSrc(ProfileDetail.image?.url)}
                      alt={ProfileDetail.name || "profile"}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg">
                      {ProfileDetail.name
                        ? ProfileDetail.name.charAt(0).toUpperCase()
                        : "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {ProfileDetail.name}
                    </span>
                    <span className="truncate text-xs">
                      {ProfileDetail.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isAdmin ? (
                  <Link href="/evaluation/all_result">
                    <DropdownMenuItem className="flex gap-2 items-center">
                      <ReplaceAll size={18} />
                      ผลการประเมินทั้งหมด
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  <Link href="/personal_evaluation">
                    <DropdownMenuItem className="flex gap-2 items-center">
                      <PieChart size={18} />
                      ผลการประเมิน
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex gap-2 items-center"
                >
                  <BadgeCheck size={18} />
                  บัญชีของฉัน
                </DropdownMenuItem>

                {isAdmin ? (
                  <Link href="/evaluation/backup_result">
                    <DropdownMenuItem className="flex gap-2 items-center">
                      <BetweenHorizontalEnd size={18} />
                      คลังเก็บข้อมูล
                    </DropdownMenuItem>
                  </Link>
                ) : (
                  <Link href="/history">
                    <DropdownMenuItem className="flex gap-2 items-center">
                      <FolderClock size={18} />
                      ประวัติผลการประเมิน
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Link href={"/sign-in"} onClick={handleLogout}>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <LogOut size={18} />
                  ออกจากระบบ
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

export default NavUser;
