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
      url: "#",
      icon: ShieldCheck,
      isActive: true,
      items: [
        {
          title: "Department & Role",
          url: "/management/department_role",
        },
        {
          title: "Form",
          url: "/management/manage_form",
        },
        {
          title: "User",
          url: "/management/manage_user",
        },
        {
          title: "Prefix",
          url: "/management/prefix",
        },
      ],
    },
    {
      title: "Evaluation",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All result",
          url: "/evaluation/all_result",
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
      name: "Overview",
      url: "/overview",
      icon: Frame,
    },
    {
      name: "Evaluated",
      url: "/evaluated",
      icon: PieChart,
    },
    {
      name: "History",
      url: "/history",
      icon: FolderClock,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [position, setPosition] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false); // สถานะของ admin
  const pathUrl = usePathname();
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
        {isAdmin && <NavMain items={data.navMain} />}
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
