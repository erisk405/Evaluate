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
import useStore from "../store/store";
import GlobalApi from "../_util/GlobalApi";
import { Role } from "@/types/interface";

type SetStatusSectionType = {
  onChange: (value: string) => void;
  value: string;
  isPending: boolean;
  defaultValue?: string;
};
export default function SetStatusSection({
  onChange,
  defaultValue,
  value,
  isPending,
}: SetStatusSectionType) {
  const [open, setOpen] = useState(false);
  const { roles, setRole, ProfileDetail } = useStore();
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      // console.log("role:", response);
      setRole(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    fetchRole();
    if (defaultValue) {
      // Set default value based on fetched roles
      const defaultRole = roles?.find((role: Role) => role.id === defaultValue);
      if (defaultRole) {
        onChange(defaultRole.id);
      }
    }
  }, [ProfileDetail]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-auto"
          disabled={isPending || ProfileDetail?.role?.role_name === "admin"}
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
              {roles.map(
                (Role) =>
                  Role.role_name !== "admin" &&
                  Role.role_name !== "member" && (
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
                        <span className="text-neutral-500">
                          {Role.description}
                        </span>
                      </div>
                    </CommandItem>
                  )
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
