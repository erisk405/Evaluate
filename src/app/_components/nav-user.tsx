"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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

export function NavUser() {
  const { isMobile } = useSidebar();
  const {
    showProfile,
    ProfileDetail,
    updateProfileDetail,
    setShowProfile,
    setShowNotifications,
    showNotifications,
  } = useStore();

  const [notifications, setNotifications] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await GlobalApi.Logout();
      // Additional logout logic like clearing local storage or redirecting
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await GlobalApi.fetchUserProfile();
      const { id, name, image, email, role, roleRequests, department } =
        response.data;

      updateProfileDetail({
        id,
        name,
        email,
        image: image ? image.url : "/profiletest.jpg",
        role,
        roleRequests,
        department: department || null,
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

    // Listen for notifications
    const handleUserNotification = (data: any) => {
      setNotifications((prev) => [...prev, data]);
    };

    socket.on("userNotification", handleUserNotification);

    // Cleanup socket listener
    return () => {
      socket.off("userNotification", handleUserNotification);
    };
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
                    src={getImageSrc(ProfileDetail.image)}
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
                      src={getImageSrc(ProfileDetail.image)}
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
                <DropdownMenuItem className="flex gap-2 items-center">
                  <Sparkles size={18} />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex gap-2 items-center"
                >
                  <BadgeCheck size={18} />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <CreditCard size={18} />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-2 items-center"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={18} />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Link href={"/sign-in"} onClick={handleLogout}>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <LogOut size={18} />
                  Log out
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
