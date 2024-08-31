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
import GlobalApi from "@/app/_unit/GlobalApi";
import { Department } from "@/types/interface";

export default function SetDepartmentUserOptions({ onRoleChange , defaultValue} : any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [ department, setDepartment ] = useState<Department[]>([]);
  const { ProfileDetail } = useStore();
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getDepartment();
      console.log("Department:", response);
      setDepartment(response?.data);
      // Set default value based on fetched roles
      const defaultDepartment = response?.data.find(
        (role: any) => role.role_name === defaultValue
      );
      if (defaultDepartment) {
        setValue(defaultDepartment.department_name);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    
    fetchRole();
    console.log("ProfileDetail",ProfileDetail);
  }, [ProfileDetail.roleRequests]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-auto"
        >
          {value
            ? department.find((item : Department) => item.department_name === value)?.department_name
            : "Select Department"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 relative -left-14">
        <Command>
          <CommandInput placeholder="Search Role..." />
          <CommandEmpty>No Role found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              { department.map((item :Department) => (
                // <FormField
                // />
                <CommandItem
                  key={item.id}
                  value={item.department_name}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    if (onRoleChange) onRoleChange(item.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.department_name ? "opacity-100" : "opacity-0"
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
  )
}
