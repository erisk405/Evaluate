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

export default function SetHeadOfDepartmentSection({
  onHeadChange,
  onDeputyChange,
  defaultValue,
  department
}: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [users, setUser] = useState<any>();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const fetchRole = async () => {
    try {
      // Set default value based on fetched roles
      const response = await GlobalApi.getDepartmentById(department.id, pagination.pageIndex, pagination.pageSize)
      setUser(response?.data?.data.user);
      if (defaultValue) {
        onHeadChange ? onHeadChange(defaultValue.id) : onDeputyChange && onDeputyChange(defaultValue.id)
        setValue(defaultValue.name);
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
                users.map((User: any) => (
                  // <FormField
                  // />
                  <CommandItem
                    key={User.id}
                    value={User.name}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? "" : currentValue;
                      setValue(newValue);
                      onHeadChange ? onHeadChange(User.id) : onDeputyChange && onDeputyChange(User.id)
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === User.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col w-[240px]">
                      {User.name}
                      <span className="text-neutral-500">{}</span>
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
