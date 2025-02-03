"use client";
import React, { useEffect, useState } from "react";
import Footer from "../_components/Footer";
import { AppSidebar } from "@/app/_components/app-sidebar";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { DynamicBreadcrumb } from "../_components/DynamicBreadcrumb";
import { NotificationPopup, ProfilePopup } from "../_components/PopupSection";
import { Bell, Moon, Sun } from "lucide-react";
import useStore from "../store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Loading from "../_components/Loading";
import { useThemeStyles } from "@/hooks/useTheme";
import ProtectedLayout from "../_components/layouts/ProtectedLayout";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { showNotifications, setShowNotifications, notificationCounts } =
    useStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const styles = useThemeStyles();
  useEffect(() => {
    setMounted(true);
  }, []);

  // การแก้ไขนี้จะช่วยป้องกัน hydration mismatch และทำให้การสลับ theme ทำงานได้อย่างถูกต้องทั้ง light และ dark mode
  if (!mounted) {
    return <Loading />; // หรือแสดง loading placeholder
  }

  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 justify-between shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <DynamicBreadcrumb />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {/* overlay for close notification */}
            <div
              onClick={() => setShowNotifications(!showNotifications)}
              className={`bg-black top-0 left-0 right-0 bottom-0  transition-all ${
                showNotifications
                  ? "block z-40 visible opacity-60 fixed"
                  : "invisible opacity-0 "
              }`}
            ></div>
            {/* icon for notificate */}
            <div className="flex items-center gap-3 mr-4 sm:mr-14">
              <div
                className={`flex gap-2 items-center cursor-pointer ${styles.hover} p-2 rounded-lg `}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <div className="relative">
                  {notificationCounts > 0 && (
                    <div
                      className={`absolute -top-2 -right-2  rounded-full bg-red-500 w-4 h-4 flex items-center justify-center`}
                    >
                      <h2 className={`text-sm text-zinc-50`}>
                        {notificationCounts}
                      </h2>
                    </div>
                  )}

                  <Bell size={18} />
                </div>
                <h2 className="hidden sm:block truncate">การแจ้งเตือน</h2>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-10 h-10">
                    {theme === "light" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div
            className={`flex justify-center ${
              theme === "light" ? "bg-white" : "bg-black"
            } relative`}
          >
            <div className="flex-1 min-h-screen  max-w-[1560px]">
              <div
                className={`flex flex-grow ${
                  theme === "light" ? "bg-gray-50" : "bg-background"
                } text-neutral-800`}
              >
                <ProtectedLayout>{children}</ProtectedLayout>
                <Toaster expand={true} closeButton />
              </div>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* ส่วนของ Profile popup */}
      <ProfilePopup />
      {/* ส่วนของ notification popup */}
      <NotificationPopup />
    </div>
  );
};

export default layout;
