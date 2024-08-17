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

export default function SetStatusSection({ onRoleChange , defaultValue ,isPending} : any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { roles, setRole } = useStore();
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      console.log("role:", response);
      setRole(response?.data);

      // Set default value based on fetched roles
      const defaultRole = response?.data.find(
        (role: any) => role.role_name === defaultValue
      );
      if (defaultRole) {
        setValue(defaultRole.role_name);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    
    fetchRole();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-auto"
          disabled = {isPending}
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
                // <FormField
                // />
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
