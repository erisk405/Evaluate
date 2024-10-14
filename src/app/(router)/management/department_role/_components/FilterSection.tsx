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
import GlobalApi from "@/app/_unit/GlobalApi";


interface FilterSectionProps {
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
}
interface formStates {
  id: string;
  name: string;
}

export default function FilterSection({
  selectedValues,
  setSelectedValues,
}: FilterSectionProps) {
  const [open, setOpen] = useState(false);
  const [form , setForm] = useState<formStates[]>([]);
  const toggleValue = (value: string) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value) // ถ้าเลือกอยู่แล้ว ให้เอาออก
        : [...selectedValues, value] // ถ้ายังไม่เลือก ให้เพิ่มเข้าไป
    );
  };
  const getForm = async () =>{
    try {
      const response = await GlobalApi.getForm();
      setForm(response?.data);
      
    } catch (error) {
      console.error({message:error});
      
    }
  }
  useEffect(()=>{
    getForm();
  },[])
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
              {form && form.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => {
                    toggleValue(item.id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (selectedValues ?? []).includes(item.id) // Fallback to an empty array if undefined
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {item.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
