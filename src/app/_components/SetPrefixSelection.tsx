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

type SetPrefixSelectionProp = {
  userPrefix?: PrefixType | null;
  value:string
  onChange: (value: string) => void;
};
export default function SetPrefixSelection({
  userPrefix,
  onChange,
  value
}: SetPrefixSelectionProp) {
  const { ProfileDetail } = useStore();
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState<PrefixType[]>([]);
  const fetchPrefix = async () => {
    try {
      const response = await GlobalApi.getPrefix();
      setPrefix(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  // ให้ เรียกใช้ function ใหม่หากเกิดการเปลี่ยนแปลงที่ rolRequest
  useEffect(() => {
    fetchPrefix();
  }, []);
  useEffect(() => {
    if (userPrefix) {
      onChange(userPrefix.prefix_id);
    } else {
      onChange(ProfileDetail.prefix ? ProfileDetail.prefix.prefix_id : '');
    }
    // console.log("prefix",ProfileDetail.prefix.prefix_id );
  }, [ProfileDetail, userPrefix]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between col-span-3"
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
                    onChange(item.prefix_id);
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
