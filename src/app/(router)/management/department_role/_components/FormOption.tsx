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
import GlobalApi from "@/app/_util/GlobalApi";

interface FormOptionProps {
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  defaultValues?: string[]; // ใช้ string[] แทน []
}
interface formStates {
  id: string;
  name: string;
}

export default function FormOption({
  selectedValues,
  setSelectedValues,
  defaultValues = [],
}: FormOptionProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<formStates[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // ใช้ useRef เพื่อบันทึกสถานะการตั้งค่า defaultValues
  const toggleValue = (selectedName: string) => {
     // หารายการที่ตรงกับชื่อที่เลือก
    const selectedItem = form.find((item) => item.name === selectedName);
    if (!selectedItem) return;

    // อัพเดท selectedValues
    setSelectedValues(
      selectedValues.includes(selectedItem.id)
        ? selectedValues.filter((v) => v !== selectedItem.id) // ถ้าเลือกอยู่แล้ว ให้เอาออก
        : [...selectedValues, selectedItem.id] // ถ้ายังไม่เลือก ให้เพิ่มเข้าไป หรือ อัพเดท
    );
    // console.log("selectedValues", selectedValues);
  };
  // ฟังก์ชันดึงข้อมูลฟอร์มจาก API
  const getForm = async () => {
    try {
      const response = await GlobalApi.getForm();
      setForm(response?.data);
      // console.log("form",response?.data);
    } catch (error) {
      console.error({ message: error });
    }
  };
  // จัดการ defaultValue เมื่อมีการโหลดข้อมูลครั้งแรก
  // Handle default values on mount
  useEffect(() => {
    getForm();
  }, []);
  // Set default values to selectedValues on mount
  // จัดการค่า defaultValues เมื่อคอมโพเนนต์ถูกโหลด


  
  useEffect(() => {
    if (defaultValues.length > 0) {
      setSelectedValues(defaultValues);
    } else {
      setSelectedValues([]);
    }
  }, []);

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
        {/* ช่องค้นหา */}
          <CommandInput
            placeholder="Search form..."
            value={searchTerm}
            onValueChange={setSearchTerm}  // อัพเดทค่า searchTerm เมื่อพิมพ์
          />
          {/* ข้อความเมื่อไม่พบรายการ */}
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {form &&
                form
                // กรองรายการตาม searchTerm
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name} // เปลี่ยนจาก id เป็น name เพราะจะ search ผ่านname
                      onSelect={(currentValue) => {
                        toggleValue(currentValue);
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
