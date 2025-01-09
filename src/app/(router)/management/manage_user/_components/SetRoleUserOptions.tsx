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
import { Role } from "@/types/interface";

type SetRoleUserOptionsType = {
  onChange: (value: string) => void;
  defaultValue: Role | null;
  value: string;
};
export default function SetRoleUserOptions({
  onChange,
  defaultValue,
  value,
}: SetRoleUserOptionsType) {
  const [open, setOpen] = useState(false);
  const { roles } = useStore();

  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    // Set default value based on fetched roles
    const defaultRole = roles.find((role: any) => role.id === defaultValue?.id);
    if (defaultRole) {
      onChange(defaultRole.id);
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
        >
          {value
            ? roles.find((Role) => Role.id === value)?.role_name
            : "Select Role"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 relative -left-14">
        <Command>
          <CommandInput placeholder="ค้นหา: ตำแหน่ง..." />
          <CommandEmpty>ไม่พบตำแหน่ง</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {roles.map((Role) => (
                <CommandItem
                  key={Role.id}
                  value={Role.role_name}
                  onSelect={(currentValue) => {
                    onChange(Role.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === Role.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-[240px]">
                    {Role.role_name}
                    <span className="text-neutral-500">{Role.description}</span>
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
