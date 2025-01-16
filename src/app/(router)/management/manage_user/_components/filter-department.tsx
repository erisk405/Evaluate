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
import { Department, PeriodType } from "@/types/interface";
import { handleErrorOnAxios } from "@/app/_util/GlobalApi";

interface FilterPeriodProps {
  onFilterDepartChange?: (value: Department) => void; // Changed from string to PeriodType
}

const FilterDeparment = ({
  onFilterDepartChange,
}: {
  onFilterDepartChange: (dept: Department | string | null) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("all");
  const { departments } = useStore();

  const handleSelect = (deptId: string | null) => {
    setSelectedId(deptId);
    if (deptId === "all") {
      onFilterDepartChange("all");
    } else {
      const selectedDept = departments.find((dept) => dept.id === deptId);
      if (selectedDept) {
        onFilterDepartChange(selectedDept);
      }
    }
    setOpen(false);
  };

  return (
    <div>
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
                {selectedId === "all"
                  ? "แสดงหน่วยงานทั้งหมด"
                  : departments.find((dept) => dept.id === selectedId)
                      ?.department_name || "เลือกหน่วยงาน"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 relative">
          <Command>
            <CommandInput placeholder="ค้นหา" />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                <CommandItem
                  key="all"
                  value="all"
                  onSelect={() => handleSelect("all")}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  แสดงหน่วยงานทั้งหมด
                </CommandItem>
                {departments.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    value={dept.id}
                    onSelect={() => handleSelect(dept.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedId === dept.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {dept.department_name}
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

export default FilterDeparment;
