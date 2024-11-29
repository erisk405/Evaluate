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
import { Department } from "@/types/interface";

export default function SetDepartmentUserOptions({
  onDepartmentChange,
  defaultValue,
}: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { departments } = useStore();
  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    if (defaultValue) {
      const defaultDepartment = departments?.find(
        (department: any) => department.id === defaultValue.id
      );
      if (defaultDepartment) {
        setValue(defaultDepartment.department_name);
        // Ensure the initial department is set
        onDepartmentChange(defaultDepartment.id);
      }
    }
  }, [defaultValue, departments, onDepartmentChange]);

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
            ? departments.find(
                (item: Department) => item.department_name === value
              )?.department_name
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
              {departments.map((item: Department) => (
                <CommandItem
                  key={item.id}
                  value={item.department_name}
                  onSelect={(currentValue) => {
                    // Ensure a department is always selected
                    const selectedDepartment = departments.find(
                      (dept) => dept.department_name === currentValue
                    );
                    if (selectedDepartment) {
                      setValue(currentValue);
                      onDepartmentChange(selectedDepartment.id);
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.department_name
                        ? "opacity-100"
                        : "opacity-0"
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
