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
  Blend
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

const data = {
  navMain: [
    {
      title: "Management",
      session:"admin",
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
      title: "Evaluation",
      url: "#",
      session:"admin",
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
        {
          title: "Export",
          url: "/evaluation/export",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      session:"user",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      session:"user",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
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
    },
    {
      name: "ผลการประเมิน",
      url: "/personal_evaluation",
      icon: PieChart,
    },
    {
      name: "ประวัติผลการประเมิน",
      url: "/history",
      icon: FolderClock,
    },
    {
      name: "บัญชีของฉัน",
      url: "/account/general-data",
      icon: Blend,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isAdmin, setIsAdmin] = React.useState(false); // สถานะของ admin
  const Protected = async () => {
    try {
      const response = await GlobalApi.fetchProtected();
      if (response.data.role === "admin") {
        setIsAdmin(true); // ถ้า role เป็น admin ให้ตั้งค่าเป็น true
      }
    } catch (error) {
      // console.error("Error fetching admin role:", error);
      setIsAdmin(false); // ในกรณีที่ดึงข้อมูลไม่สำเร็จ หรือตรวจสอบ role ไม่ผ่าน
    }
  };
  React.useEffect(() => {
    Protected();
  }, []);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image
                    src={'/logo.png'}
                    width={40}
                    height={40}
                    alt="icon logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Evaluation 360 degree</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={isAdmin ? data.navMain : data.navMain.filter(item => item.session !== 'admin')} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
