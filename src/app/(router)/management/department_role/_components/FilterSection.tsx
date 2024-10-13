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
import { useEffect, useState } from "react";
import { CommandList } from "cmdk";

const frameworks = [
  {
    value: "Psychomotor",
    label: "Form จิตพิสัย",
  },
  {
    value: "working",
    label: "Form การทำงาน",
  },
  {
    value: "Knowledge",
    label: "Form ความรู้ด้านวิชาการ",
  },
  {
    value: "skill",
    label: "Form ทักษะในการทำงาน",
  },
];

interface FilterSectionProps {
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
}

export default function FilterSection({
  selectedValues,
  setSelectedValues,
}: FilterSectionProps) {
  const [open, setOpen] = useState(false);

  const toggleValue = (value: string) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value) // ถ้าเลือกอยู่แล้ว ให้เอาออก
        : [...selectedValues, value] // ถ้ายังไม่เลือก ให้เพิ่มเข้าไป
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValues?.length > 0
            ? `Selected ${selectedValues.length} form(s)`
            : "Select form..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search form..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={() => {
                    toggleValue(framework.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (selectedValues ?? []).includes(framework.value) // Fallback to an empty array if undefined
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {framework.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
