"use client";

import { Check, ChevronsUpDown, Crown } from "lucide-react";

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
import GlobalApi from "@/app/_unit/GlobalApi";
import { User } from "@/types/interface";
import Image from "next/image";

export default function SetHeadOfDepartmentSection({
  onSuperviserChange,
  defaultValue,
}: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [users, setUser] = useState<User[] | undefined>();
  const fetchRole = async () => {
    try {
      // Set default value based on fetched roles
      const response = await GlobalApi.getAllUsers();
      const filterUser = response?.data?.filter(
        (item: User) =>
          item.role.role_level === "LEVEL_3" ||
          item.role.role_level === "LEVEL_4"
      );
      setUser(filterUser);
      console.log("defaultValue",defaultValue);

      if (defaultValue) {
        onSuperviserChange && onSuperviserChange(defaultValue.id);
        setValue(defaultValue.user.name);
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
          className="justify-between w-full"
        >
          {value
            ? users?.find((User: any) => User.name === value)?.name
            : "Select"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 relative">
        <Command>
          <CommandInput placeholder="Search Role..." />
          <CommandEmpty>No Role found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {users ? (
                users.map((User: User) => (
                  // <FormField
                  // />
                  <CommandItem
                    key={User.id}
                    value={User.name}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? "" : currentValue;
                      setValue(newValue);
                      onSuperviserChange && onSuperviserChange(User.id)
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === User.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2 w-[240px]">
                      <Image
                        src={User.image.url}
                        width={30}
                        height={30}
                        alt="userEliteProfile"
                        className="w-[30px] h-[30px] object-cover rounded-full"
                      />
                      <div className="grid grid-cols-1">
                        <h2>{User.name}</h2>
                        <span className="text-neutral-500">
                          {User.department?.department_name}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))
              ) : (
                <div></div>
              )}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
