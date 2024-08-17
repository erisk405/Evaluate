import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeCheck, Plus, Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Allrole = [
  {
    id: "Ar1",
    name: "Admin",
    description: "All permission",
  },
  {
    id: "Ar2",
    name: "ผู้อำนวยการ",
    description: "ประมาณรอง",
  },
  {
    id: "Ar3",
    name: "รองผู๋อำนวยการ",
    description: "ประมาณหัวหน้า",
  },
  {
    id: "Ar4",
    name: "หัวหน้างานวิชาการ",
    description: "บุคลากร",
  },
  {
    id: "Ar5",
    name: "บุคลากรทั่วไป",
    description: "ประเมิณกันเอง",
  },
];

const ManageRole = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Role</h2>
      <div className="flex justify-between items-center my-3">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Assigned role</Label>
        </div>
        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outline" className="p-2 active:scale-95">
                    <Plus />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Role</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-3 ">
        {Allrole.map((item) => (
          <div
            key={item.id}
            className="px-3 w-full h-14 bg-gray-50 rounded-xl flex justify-between items-center"
          >
            <div className="flex items-center gap-1">
              <BadgeCheck className="text-white bg-blue-500 overflow-hidden rounded-full"/>
              <h2 className="text-lg font-bold text-black">{item.name}</h2>
            </div>
            <Button className="flex items-center gap-2 active:scale-95 ">
              <Settings2 size={18} /> Permission
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRole;
