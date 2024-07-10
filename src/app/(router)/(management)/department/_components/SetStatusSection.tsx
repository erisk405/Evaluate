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
import { useState } from "react";

const Roles = [
  {
    value: "general",
    label: "General",
    description:''
  },
  {
    value: "user",
    label: "User",
    description:''
  },
  {
    value: "bember",
    label: "Member",
    description:''
  },
  {
    value: "develop",
    label: "Develop",
    description:''
  },
  {
    value: "owner",
    label: "Owner",
    description:''
  },
];

export default function SetStatusSection() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[120px] "
        >
          {value
            ? Roles.find((Role) => Role.value === value)?.label
            : "Select Role"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 relative -left-10">
        <Command>
          <CommandInput placeholder="Search Role..." />
          <CommandEmpty>No Role found.</CommandEmpty>
          <CommandGroup >
            <CommandList>
              {Roles.map((Role) => (
                <CommandItem
                  key={Role.value}
                  value={Role.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === Role.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {Role.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
