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

export default function SetRoleUserOptions({
  onRoleChange,
  defaultValue,
}: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { roles } = useStore();

  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    console.log("roles", roles);

    // Set default value based on fetched roles
    const defaultRole = roles.find(
      (role: any) => role.id === defaultValue.id
    );
    console.log("defaultRole",defaultRole);
    
    if (defaultRole) {
      setValue(defaultRole.role_name);
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
            ? roles.find((Role) => Role.role_name === value)?.role_name
            : "Select Role"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 relative -left-14">
        <Command>
          <CommandInput placeholder="Search Role..." />
          <CommandEmpty>No Role found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {roles.map((Role) => (
                <CommandItem
                  key={Role.id}
                  value={Role.role_name}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    if (onRoleChange) onRoleChange(Role.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === Role.role_name ? "opacity-100" : "opacity-0"
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
