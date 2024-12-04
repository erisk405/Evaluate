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
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <DynamicBreadcrumb />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex justify-center bg-white relative">
            <div className="flex-1 min-h-screen  max-w-[1560px]">
              <div className="flex flex-grow bg-gray-50 rounded-xl text-neutral-800">
                {/* <div className="">
                  <SideBar />
                </div> */}
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
    </>
  );
};

export default layout;
