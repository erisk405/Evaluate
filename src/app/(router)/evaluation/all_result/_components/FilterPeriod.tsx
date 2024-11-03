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

const itemsPeriod = [
  {
    id: "IP01",
    label: "รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2568",
  },
  {
    id: "IP02",
    label: "รอบที่ 2 ประจำปีงบประมาณ พ.ศ. 2568",
  },
  {
    id: "IP03",
    label: "รอบที่ 1 ประจำปีงบประมาณ พ.ศ. 2567",
  },
  {
    id: "IP04",
    label: "รอบที่ 2 ประจำปีงบประมาณ พ.ศ. 2567",
  },
] as const;

interface FilterPeriodProps {
  onPeriodChange?: (value: string) => void;
  defaultValue?: string;
}

const FilterPeriod = ({ onPeriodChange, defaultValue }: any) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("IP01");

  useEffect(() => {
    console.log("Value:", value);
  }, [value]);
  return (
    <div>
      {" "}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full"
          >
            <div className="flex items-center justify-between w-full">
              <span className="truncate">
                {itemsPeriod.find((period) => period.label === value)?.label ||
                  "เลือกรอบการประเมิน"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 relative">
          <Command>
            <CommandInput placeholder="ค้นหา" />
            <CommandEmpty>No period found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {itemsPeriod.map((period) => (
                  <CommandItem
                    key={period.id}
                    value={period.label}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      if (onPeriodChange) {
                        onPeriodChange(currentValue);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === period.label ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {period.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterPeriod;
