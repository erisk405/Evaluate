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
import { PrefixType } from "@/types/interface";

export default function SetPrefixSelection({
  onPrefixChange,
  userPrefix,
}: any) {
  const { ProfileDetail } = useStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>("");
  const [prefix, setPrefix] = useState<PrefixType[]>([]);
  const fetchPrefix = async () => {
    try {
      const response = await GlobalApi.getPrefix();
      setPrefix(response?.data);
      if (userPrefix) {
        setValue(userPrefix ? userPrefix.prefix_id : null);
      } else {
        setValue(ProfileDetail.prefix ? ProfileDetail.prefix.prefix_id : null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    fetchPrefix();
  }, [ProfileDetail]);

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
            ? prefix.find((item) => item.prefix_id === value)?.prefix_name
            : "คำนำหน้า"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0 relative">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No prefix found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {prefix.map((item) => (
                <CommandItem
                  key={item.prefix_id}
                  value={item.prefix_id}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    if (onPrefixChange) onPrefixChange(item.prefix_id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.prefix_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col w-[240px]">
                    {item.prefix_name}
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
