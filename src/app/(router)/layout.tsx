"use client";
import React from "react";
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
import { Bell } from "lucide-react";
import useStore from "../store/store";
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { setShowNotifications, showNotifications } = useStore();
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
            <div
              className="flex gap-2 items-center mr-14 cursor-pointer hover:bg-neutral-200 p-2 rounded-lg "
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              Notifications
            </div>
          </header>
          <div className="flex justify-center bg-white relative">
            <div className="flex-1 min-h-screen  max-w-[1560px]">
              <div className="flex flex-grow bg-gray-50 rounded-xl text-neutral-800">
                {children}
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
