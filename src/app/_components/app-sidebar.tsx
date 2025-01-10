"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  FolderClock,
  PieChart,
  Send,
  Settings2,
  ShieldCheck,
  Vault,
  Blend,
} from "lucide-react";

import { NavMain } from "@/app/_components/nav-main";
import { NavProjects } from "@/app/_components/nav-projects";
import { NavSecondary } from "@/app/_components/nav-secondary";
import { NavUser } from "@/app/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import GlobalApi from "../_util/GlobalApi";
import Image from "next/image";
import { Permission, Role } from "../(auth)/type/auth";
import { useAuthState } from "@/hooks/useAuthState";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "การจัดการ",
      session: "admin",
      url: "#",
      icon: ShieldCheck,
      isActive: true,
      items: [
        {
          title: "หน่วยงาน & ตำแหน่ง",
          url: "/management/department_role",
        },
        {
          title: "แบบฟอร์ม",
          url: "/management/manage_form",
        },
        {
          title: "ผู้ใช้งาน",
          url: "/management/manage_user",
        },
        {
          title: "คำนำหน้า",
          url: "/management/prefix",
        },
      ],
    },
    {
      title: "การประเมินผล",
      url: "#",
      session: "admin",
      icon: Bot,
      items: [
        {
          title: "ผลการประเมินทั้งหมด",
          url: "/evaluation/all_result",
        },
        {
          title: "คลังเก็บข้อมูล",
          url: "/evaluation/backup_result",
        },
      ],
    },
    {
      title: "คู่มือและเอกสาร",
      url: "#",
      session: "user",
      icon: BookOpen,
      items: [
        {
          title: "การใช้งานเบื้องต้น(ยังไม่พร้อมใช้งาน)",
          url: "#",
        },
        {
          title: "หากลืมรหัสผ่าน(ยังไม่พร้อมใช้งาน)",
          url: "#",
        },
        {
          title: "การตั้งค่าในส่วนแอดมิน(ยังไม่พร้อมใช้งาน)",
          url: "#",
        },
        {
          title: "การจัดการปัญหาต่างๆ(ยังไม่พร้อมใช้งาน)",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "หน้าหลัก",
      url: "/overview",
      icon: Frame,
      requiredPermission: "view:projects" as Permission,
    },
    {
      name: "ผลการประเมิน",
      url: "/personal_evaluation",
      icon: PieChart,
      requiredPermission: "view:projects_users" as Permission,
    },
    {
      name: "ประวัติผลการประเมิน",
      url: "/history",
      icon: FolderClock,
      requiredPermission: "view:projects_users" as Permission,
    },
    {
      name: "บัญชีของฉัน",
      url: "/account/general-data",
      icon: Blend,
      requiredPermission: "view:projects" as Permission,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin, user, isLoading } = useAuthState();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/overview">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image
                    src={"/logo.png"}
                    width={40}
                    height={40}
                    alt="icon logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Evaluation 360 degree
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            isAdmin
              ? data.navMain
              : data.navMain.filter((item) => item.session !== "admin")
          }
        />
        <NavProjects projects={data.projects} user={user} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
