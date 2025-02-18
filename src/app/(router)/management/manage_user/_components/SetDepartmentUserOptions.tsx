"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { useEffect, useState } from "react";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_util/GlobalApi";
import { Department, User } from "@/types/interface";

type SetDepartmentUserOptionsProp = {
  isAdmin: boolean;
  defaultValue?: Department | string;
  onChange: (data: string) => void;
  value: string;
  fromAdmin?: boolean;
};
export default function SetDepartmentUserOptions({
  isAdmin,
  defaultValue,
  onChange,
  value,
  fromAdmin,
}: SetDepartmentUserOptionsProp) {
  const [open, setOpen] = useState(false);
  const { departments, setDepartments, ProfileDetail } = useStore();
  const getDepartment = async () => {
    try {
      const response = await GlobalApi.getDepartment();
      setDepartments(response?.data); // ตั้งค่าเป็นอาเรย์ว่างถ้าไม่มีข้อมูล
      // console.log("departments", departments);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };
  useEffect(() => {
    if (defaultValue && typeof defaultValue !== "string") {
      const defaultDepartment = departments?.find(
        (department: Department) => department.id === defaultValue.id
      );
      if (defaultDepartment) {
        onChange(defaultDepartment.id);
      }
    } else if (defaultValue && typeof defaultValue === "string") {
      // กรณีที่ defaultValue เป็น string (id)
      const defaultDepartment = departments?.find(
        (department: Department) => department.id === defaultValue
      );
      if (defaultDepartment) {
        onChange(defaultValue);
      }
    }
  }, [defaultValue, departments]);
  useEffect(() => {
    if (departments.length === 0) {
      getDepartment();
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-auto"
          disabled={
            fromAdmin
              ? isAdmin
              : !["member"].includes(ProfileDetail.role!.role_name)
          }
        >
          {value
            ? departments.find((item: Department) => item.id === value)
                ?.department_name || "Select Department"
            : "Select Department"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 relative">
        <Command>
          <CommandInput placeholder="ค้นหา: ชื่อหน่วยงาน..." />
          <CommandEmpty>ไม่พบหน่วยงาน</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {departments.map((item: Department) => (
                <CommandItem
                  key={item.id}
                  value={item.department_name}
                  onSelect={(currentValue) => {
                    const selectedDepartment = departments.find(
                      (dept) => dept.department_name === currentValue
                    );
                    if (selectedDepartment) {
                      onChange(selectedDepartment.id); // ใช้ onChange โดยตรง
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-[240px]">
                    {item.department_name}
                    <span className="text-neutral-500">{}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
