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
import {
  BadgeAlert,
  BadgeCheck,
  Plus,
  Settings2,
  ShieldPlus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FilterSection from "./FilterSection";
import { Textarea } from "@/components/ui/textarea";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Allrole = [
  {
    id: "Ar1",
    name: "Admin",
    description:
      "All permission Lorem ipsum dolor, sit amet consectetur adipisicing ",
  },
  {
    id: "Ar2",
    name: "ผู้อำนวยการ",
    description:
      "ประมาณรอง Lorem ipsum dolor, sit amet consectetur adipisicing ",
  },
  {
    id: "Ar3",
    name: "รองผู๋อำนวยการ",
    description:
      "ประมาณหัวหน้า Lorem ipsum dolor, sit amet consectetur adipisicing ",
  },
  {
    id: "Ar4",
    name: "หัวหน้างานวิชาการ",
    description: "บุคลากร Lorem ipsum dolor, sit amet consectetur adipisicing ",
  },
  {
    id: "Ar5",
    name: "บุคลากรทั่วไป",
    description:
      "ประเมิณกันเอง Lorem ipsum dolor, sit amet consectetur adipisicing ",
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
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                <div className="flex gap-2 items-center">
                  <div className="block p-1 bg-blue-100 rounded-full">
                    <ShieldPlus size={40} className="text-blue-500 " />{" "}
                  </div>
                  <h2 className="text-xl">Create role</h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 px-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue="Dog role"
                  className="col-span-3"
                />
              </div>
              <hr />
              <div className="flex items-center gap-2 font-semibold">
                <BadgeAlert className="text-blue-500 bg-white rounded-full " />{" "}
                <h2>Set role permission form evaluate</h2>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                {Allrole.map(
                  (item) =>
                    item.name !== "Admin" && (
                      <div className="col-span-2 " key={item.id + "dog"}>
                        <Label
                          htmlFor="permission"
                          className="text-left col-span-2"
                        >
                          {item.name}
                        </Label>
                        <div className="w-full ">
                          <FilterSection />
                        </div>
                      </div>
                    )
                )}
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="message-2">Your Describtion</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message-2"
                />
                <p className="text-sm text-muted-foreground">
                  Your message will be copied to the describtion role.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col  ">
        {Allrole.map((item) => (
          <Accordion type="single" collapsible className="w-full" key={item.id}>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="px-3 w-full h-14 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="text-white bg-blue-500 overflow-hidden rounded-full" />
                    <h2 className="text-lg font-bold text-black">
                      {item.name}
                    </h2>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="w-full">
                  <p className="text-lg">{item.description}</p>
                  <div className="w-full flex justify-end gap-3 mt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex items-center gap-2 px-2 h-9 active:scale-95">
                          ลบรายการ
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-red-500">
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                            การดำเนินการนี้จะลบบัญชีของคุณอย่างถาวรและลบตำแหน่งนี้
                            ออกจากเซิร์ฟเวอร์ของเรา
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 px-2 h-9 active:scale-95 ">
                          <Settings2 size={18} /> กำหนดสิทธิ
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>
                            <div className="flex gap-2 items-center">
                              <div className="block p-1 bg-blue-100 rounded-full">
                                <ShieldPlus
                                  size={40}
                                  className="text-blue-500 "
                                />{" "}
                              </div>
                              <h2 className="text-xl">Edit role</h2>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 px-4">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="name" className="">
                              Name
                            </Label>
                            <Input
                              id="name"
                              defaultValue="Dog role"
                              className="col-span-3"
                            />
                          </div>
                          <hr />
                          <div className="flex items-center gap-2 font-semibold">
                            <BadgeAlert className="text-blue-500 bg-white rounded-full " />{" "}
                            <h2>Set role permission form evaluate</h2>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            {Allrole.map(
                              (item) =>
                                item.name !== "Admin" && (
                                  <div
                                    className="col-span-2 "
                                    key={item.id + "dog"}
                                  >
                                    <Label
                                      htmlFor="permission"
                                      className="text-left col-span-2"
                                    >
                                      {item.name}
                                    </Label>
                                    <div className="w-full ">
                                      <FilterSection />
                                    </div>
                                  </div>
                                )
                            )}
                          </div>

                          <div className="grid w-full gap-1.5">
                            <Label htmlFor="message-2">Your Describtion</Label>
                            <Textarea
                              placeholder="Type your message here."
                              id="message-2"
                            />
                            <p className="text-sm text-muted-foreground">
                              Your message will be copied to the describtion
                              role.
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default ManageRole;
