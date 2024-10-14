import React, { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import useStore from "@/app/store/store";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  roleName: z
    .string()
    .min(5, { message: "Role name must be at least 5 characters." }) // ขั้นต่ำ 5 ตัวอักษร
    .max(50, { message: "Role name must not exceed 50 characters." }), // สูงสุด 50 ตัวอักษร
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }) // ขั้นต่ำ 10 ตัวอักษร
    .max(100, { message: "Description must not exceed 100 characters." }), // สูงสุด 100 ตัวอักษร
  roleLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"], {
    required_error: "Please select a role level.",
  }),
});

// Define the type for a single permission
type Permission = {
  internal: string[];
  external: string[];
};

// Define the type for the permissions state
type Permissions = {
  [key: string]: Permission;
};

const ManageRole = () => {
  const { roles } = useStore();
  const [permissions, setPermissions] = useState<Permissions>(
    roles
      .filter(
        (role) => role.role_name !== "admin" && role.role_name !== "member"
      )
      .reduce(
        (acc, role) => ({
          ...acc,
          [role.role_name]: { id: role.id, internal: [], external: [] },
        }),
        {} as Permissions
      )
  );
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: "",
      description: "", // เพิ่มค่า default สำหรับ description
      roleLevel: undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(permissions);
    
    console.log(values);
    try {
      setLoading(true);
    } catch (error) {
      setLoading(false);
    }
  };
  // function ที่ใช้ เพื่อประกอบ JSON ออกมาแล้ว ส่งไปอัพเดท
  const handleFilterChange = (
    roleID: string,
    roleName: string, // อััพเดทที่ role id อะไร
    type: "internal" | "external", //ภายในหรือภายนอกหน่วยงาน
    newValues: string[] // id ของแบบฟอร์ที่ส่งมาจาก Server
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [roleName]: {
        ...prev[roleName], // ถ้าไม่คัดลอกค่าเดิมไว้ ตอนSetใหม่ค่าเก่ามันจะหาย
        ["id"]: roleID,
        [type]: newValues,
      } as any,
    }));
  };
  return (
    <div>
      <h2 className="text-2xl font-bold">Manage Role</h2>
      <div className="flex justify-between items-center my-3">
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Assigned role</Label>
        </div>

        {/* ส่วนของการสร้างRole */}
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
          <DialogContent className="sm:max-w-[625px]">
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4 py-4 px-4"
              >
                {/* Role name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      control={form.control}
                      name="roleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Role level */}
                  <div>
                    <div>
                      <FormField
                        control={form.control}
                        name="roleLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full ">
                                  <SelectValue placeholder="Select a level " />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="LEVEL_1">Level 1</SelectItem>
                                <SelectItem value="LEVEL_2">Level 2</SelectItem>
                                <SelectItem value="LEVEL_3">Level 3</SelectItem>
                                <SelectItem value="LEVEL_4">Level 4</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      ></FormField>
                    </div>
                  </div>
                </div>
                <hr />
                {/* body header */}
                <div className="flex items-center gap-2 font-semibold">
                  <BadgeAlert className="text-blue-500 bg-white rounded-full " />{" "}
                  <h2>Set role permission form evaluate</h2>
                </div>
                {/* Set role permission form evaluate */}
                <div className="grid grid-cols-4 items-center gap-4">
                  {roles.map(
                    (item) =>
                      item.role_name !== "admin" &&
                      item.role_name !== "member" && (
                        <div className="col-span-2 " key={item.id}>
                          <Label
                            htmlFor="permission"
                            className="text-left col-span-2"
                          >
                            {item.role_name}
                          </Label>
                          <div className="w-full mt-2">
                            <div className="ml-4">
                              <h2 className="text-sm">ภายในกลุ่มงาน</h2>
                              <FilterSection
                                selectedValues={
                                  permissions[item.role_name]?.internal || []
                                }
                                setSelectedValues={(newValues) =>
                                  handleFilterChange(
                                    item.id,
                                    item.role_name,
                                    "internal",
                                    newValues
                                  )
                                }
                              />
                            </div>
                            <div className="ml-4 mt-2">
                              <h2 className="text-sm">ภายนอกกลุ่มงาน</h2>
                              <FilterSection
                                selectedValues={
                                  permissions[item.role_name]?.external || []
                                }
                                setSelectedValues={(newValues) =>
                                  handleFilterChange(
                                    item.id,
                                    item.role_name,
                                    "external",
                                    newValues
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
                {/* discription */}
                <div className="grid w-full gap-1.5">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Your Describtion</Label>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message here."
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Your message will be copied to the describtion role.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Save changes</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ส่วนของการปรับปรุงแก้ไขRole */}

      <div className="flex flex-col  ">
        {roles.map(
          (item) =>
            item.role_name !== "admin" &&
            item.role_name !== "member" && (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                key={item.id}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="px-3 w-full h-14 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <BadgeCheck className="text-white bg-blue-500 overflow-hidden rounded-full" />
                        <h2 className="text-lg font-bold text-black">
                          {item.role_name}
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
                          <DialogContent className="sm:max-w-[625px]">
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
                                Make changes to your profile here. Click save
                                when you're done.
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
                                {roles.map(
                                  (item) =>
                                    item.role_name !== "admin" &&
                                    item.role_name !== "member" && (
                                      <div
                                        className="col-span-2 "
                                        key={item.id}
                                      >
                                        <Label
                                          htmlFor="permission"
                                          className="text-left col-span-2"
                                        >
                                          {item.role_name}
                                        </Label>

                                        <div className="w-full mt-2">
                                          <div className="ml-4">
                                            <h2 className="text-sm">
                                              ภายในกลุ่มงาน
                                            </h2>
                                            <FilterSection
                                              selectedValues={
                                                permissions[item.role_name]
                                                  ?.internal || []
                                              }
                                              setSelectedValues={(newValues) =>
                                                handleFilterChange(
                                                  item.id,
                                                  item.role_name,
                                                  "internal",
                                                  newValues
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="ml-4 mt-2">
                                            <h2 className="text-sm">
                                              ภายนอกกลุ่มงาน
                                            </h2>
                                            <FilterSection
                                              selectedValues={
                                                permissions[item.role_name]
                                                  ?.external || []
                                              }
                                              setSelectedValues={(newValues) =>
                                                handleFilterChange(
                                                  item.id,
                                                  item.role_name,
                                                  "external",
                                                  newValues
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )
                                )}
                              </div>

                              <div className="grid w-full gap-1.5">
                                <Label htmlFor="message-2">
                                  Your Describtion
                                </Label>
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
            )
        )}
      </div>
    </div>
  );
};

export default ManageRole;
