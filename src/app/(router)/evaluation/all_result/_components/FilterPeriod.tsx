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
import { PeriodType } from "@/types/interface";
import { handleErrorOnAxios } from "@/app/_util/GlobalApi";

interface FilterPeriodProps {
  onPeriodChange?: (value: PeriodType) => void; // Changed from string to PeriodType
}

const FilterPeriod = ({ onPeriodChange }: FilterPeriodProps) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(""); // เพิ่ม state สำหรับเก็บ ID
  const [periods, setPeriods] = useState<PeriodType[]>([]);
  const { fetchCurrentPeriod } = useStore();
  useEffect(() => {
    const initialfetch = async () => {
      try {
        const data = await fetchCurrentPeriod();
        if(data.length === 0){
          throw new Error("Don't have period in database")
        }
        setPeriods(data);
        setSelectedId(data[0].period_id);
        // ตรวจสอบว่า onPeriodChange มีค่าก่อนเรียกใช้
        if (onPeriodChange) {
          onPeriodChange(data[0] ?? []);
        }
      } catch (error) {
        handleErrorOnAxios(error);
      }
    };
    initialfetch();
  }, []);
  // useEffect(() => {
  //   console.log("value", value);
  // }, [value]);
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
                {periods.find((period) => period.period_id === selectedId)
                  ?.title || "เลือกรอบการประเมิน"}
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
                {periods.map((period) => (
                  <CommandItem
                    key={period.period_id}
                    value={period.title}
                    onSelect={(currentTitle) => {
                      if (onPeriodChange) {
                        // Find the full period object and pass it to the callback
                        const selectedPeriod = periods.find(
                          (p) => p.title === currentTitle
                        );
                        if (selectedPeriod) {
                          setSelectedId(selectedPeriod.period_id);
                          if (onPeriodChange) {
                            onPeriodChange(selectedPeriod);
                          }
                        }
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedId  === period.period_id  ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {period.title}
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
