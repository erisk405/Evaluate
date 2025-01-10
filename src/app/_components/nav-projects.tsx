"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Permission, Role } from "../(auth)/type/auth";
import { hasPermission } from "../(auth)/type/auth";

interface Project {
  name: string;
  url: string;
  icon: LucideIcon;
  requiredPermission: Permission;
}
interface NavProjectsProps {
  projects: Project[];
  user?:
    | {
        id: string;
        role: Role;
      }
    | null
    | undefined;
}
export function NavProjects({ projects, user }: NavProjectsProps) {
  const { isMobile } = useSidebar();
  // Filter projects based on permissions
  const allowedProjects = projects.filter((project) =>
    hasPermission(user, project.requiredPermission)
  );
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {allowedProjects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
