"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BadgeAlert,
  BadgeCheck,
  Dot,
  Loader,
  Plus,
  Settings2,
  ShieldPlus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import FilterSection from "./FormOption";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/app/store/store";

import { object, z } from "zod";
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
import GlobalApi, { handleErrorOnAxios } from "@/app/_util/GlobalApi";
import EditRoleDialog from "./EditRoleDialog";
import { toast } from "@/components/ui/use-toast";
import { useThemeStyles } from "@/hooks/useTheme";

const formSchema = z.object({
  roleName: z
    .string()
    .min(5, { message: "ชื่อตำแหน่งต้องมีขั้นต่ำ 5 ตัวอักษร" }) // ขั้นต่ำ 5 ตัวอักษร
    .max(50, { message: "ชื่อตำแหน่งมีสูงสุดได้ 50 ตัวอักษร" }), // สูงสุด 50 ตัวอักษร
  description: z
    .string()
    .min(10, { message: "คำอธิบายต้องมีขั้นต่ำ 10 ตัวอักษร" }) // ขั้นต่ำ 10 ตัวอักษร
    .max(100, { message: "คำอธิบายไม่สามารถมีได้เกิน 100 ตัวอักษร" }), // สูงสุด 100 ตัวอักษร
  roleLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"], {
    required_error: "กรุณากำหนดระดับของตำแหน่งนี้",
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
  const { roles, setRole } = useStore();
  const styles = useThemeStyles();
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
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: "",
      description: "", // เพิ่มค่า default สำหรับ description
      roleLevel: undefined,
    },
  });
  const fetchRole = async () => {
    try {
      const response = await GlobalApi.getRole();
      // update Role เมื่อมีการอัพเดท
      setRole(response?.data);
    } catch (error) {
      console.log({ messsage: error });
    }
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const newRole = await GlobalApi.createRole(values);
      const permissionsKeys = Object.keys(permissions); //เพื่อรับรายการคีย์ของอ็อบเจ็กต์ permissions แล้วทำงานต่อด้วยอาร์เรย์นั้น
      if (permissionsKeys.length > 0) {
        const assessorId: string = newRole?.data?.id;
        const newPermission = await GlobalApi.createPermission(
          permissions,
          assessorId
        );
      }

      // อัพเดทRole
      fetchRole();
      setLoading(false);
      setOpen(false); // ปิด Dialog เมื่อ loading เสร็จสิ้น
      toast({
        title: "ดำเนินการเสร็จเรียบร้อยแล้ว ✅",
        description: "ระบบได้สร้าง Role เรียบร้อยแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify({ message: error }, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  };
  const onUpdate = async (values: any, id: string) => {
    try {
      // --------------------------------------------
      // update ข้อมูลของ Role พวก ชื่อ คำอธิบาย และ Level
      // --------------------------------------------
      const payload = {
        role_id: id,
        roleName: values.roleName,
        description: values.description,
        roleLevel: values.roleLevel,
      };
      setLoading(true);
      const response = await GlobalApi.updateRole(payload);
      if (!response) {
        throw new Error("อัพเดทตำแหน่งล้มเหลว");
      }

      // -----------------------------------------------------
      // update ข้อมูลของ Role พวก permission การจัดการ form ต่างๆ
      // -----------------------------------------------------
      const data = {
        assessorId: id,
        permissions,
      };
      const responsePermis = await GlobalApi.updatePermission(data);
      if (!response) {
        throw new Error("อัพเดทการกำหนดสิทธิ์ล้มเหลว");
      }
      fetchRole();
      setLoading(false);
      setOpenUpdate(false); // ปิด Dialog เมื่อ loading เสร็จสิ้น

      toast({
        title: "อัพเดทเสร็จเรียบร้อยแล้ว ✅",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(responsePermis?.data.message, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      handleErrorOnAxios(error);
    }
  };

  const deleteRole = async (id: string) => {
    toast({
      title: "กำลังดำเนินการ",
      description: "ระบบกำลังดำเนินการลบ ตำแหน่ง นี้ออกจากฐานข้อมูล",
    });
    try {
      const response = await GlobalApi.deleteRole(id);
      if (response && response.status === 201) {
        toast({
          title: "ดำเนินการเสร็จเรียบร้อย ✅",
          description: "ระบบได้ลบ ตำแหน่ง นี้ออกจากฐานข้อมูลเรียบร้อยแล้ว",
        });
      }
      // อัพเดท roles ใน store หลังจากลบสำเร็จ
      const updatedRoles = roles.filter((role) => role.id !== id);
      setRole(updatedRoles);
      // อัพเดท permissions state ด้วย
      setPermissions({});
    } catch (error: any) {
      console.log("error", { message: error });

      toast({
        title:
          "เกิดข้อผิดพลาด: โปรดตรวจสอบให้แน่ใจว่า ไม่มีผู้ใช้คนไหนกำลังใช้Role นี้อยู่",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
            <code className="text-white whitespace-pre-wrap break-words">
              {JSON.stringify(error?.response?.data?.message, null, 2)}
            </code>
          </pre>
        ),
      });
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
    <div className={`@container ${styles.text}`}>
      <div className="flex justify-between items-center my-3">
        <h2 className="text-3xl">
          <span>🎓</span>การจัดการ<span className="text-blue-400">ตำแหน่ง</span>
        </h2>
      </div>
      {/* ส่วนของการสร้างRole */}
      <div className="grid grid-cols-3 gap-3">
        <p className={`${styles.text_description} col-span-2`}>
          ใช้ในจัดการสิทธิ์และรูปแบบฟอร์มที่จะใช้ในการประเมินต่างๆ
        </p>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="p-2 active:scale-95">
              <Plus />
              สร้างตำแหน่ง
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                <div className="flex gap-2 items-center">
                  <div className="block p-1 bg-blue-100 rounded-full">
                    <ShieldPlus size={40} className="text-blue-500 " />{" "}
                  </div>
                  <h2 className="text-xl">สร้างตำแหน่ง</h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                ใช้ในจัดการสิทธิ์และรูปแบบฟอร์มที่จะใช้ในการประเมินต่างๆ
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
                          <FormLabel>ชื่อตำแหน่ง</FormLabel>
                          <FormControl>
                            <Input placeholder="บุคลากรทั่วไป..." {...field} />
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
                            <FormLabel>ระดับ</FormLabel>
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
                                <SelectItem value="LEVEL_1">
                                  Level 1 {"(ผู้ใช้งานทั่วไป)"}
                                </SelectItem>
                                <SelectItem value="LEVEL_2">
                                  Level 2{" "}
                                  {
                                    "(ดูผลของผู้ใช้งานอื่นที่ตนเองสังกัดอยู่ได้)"
                                  }
                                </SelectItem>
                                <SelectItem value="LEVEL_3">
                                  Level 3 {"(กำกับดูแลหน่วยงานอื่นได้)"}
                                </SelectItem>
                                <SelectItem value="LEVEL_4">
                                  Level 4 {"(ดูผลภาพรวมได้)"}
                                </SelectItem>
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
                  <h2>กำหนดแบบฟอร์มในแต่ละตำแหน่งเพื่อใช้งานการประเมินผล</h2>
                </div>
                {/* Set role permission form evaluate */}
                <div className="grid grid-cols-4 items-center shadow-inner p-2 gap-4 overflow-scroll h-[35dvh] scrollbar-gemini rounded-lg">
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
                        <Label>คำอธิบายของตำแหน่งนี้</Label>
                        <FormControl>
                          <Textarea
                            placeholder="พิมพ์ข้อความที่นี่อย่างน้อย 10 ตัวอักษร"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          สามารถอธิบายที่มาหรือขอบเขตของตำแหน่งนี้ได้
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {!loading ? (
                  <Button type="submit">Save Change</Button>
                ) : (
                  <Button className="animate-pulse" type="button">
                    <Loader className="animate-spin" />
                  </Button>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --------------------------------------------------------- */}
      {/*                ส่วนของการปรับปรุงแก้ไขRole                    */}
      {/* --------------------------------------------------------- */}
      {/* <UpdateRole /> */}
      <div className="flex flex-col">
        <Accordion type="single" collapsible className="w-full">
          {roles.map(
            (item) =>
              item.role_name !== "admin" &&
              item.role_name !== "member" && (
                <AccordionItem value={item.id} key={item.id}>
                  <AccordionTrigger>
                    <div
                      className={`px-3 w-full h-14 rounded-xl flex justify-between items-center ${styles.text}`}
                    >
                      <div className="flex items-center gap-1">
                        <BadgeCheck className="text-white bg-blue-500 overflow-hidden rounded-full" />
                        <h2 className="text-lg ">{item.role_name}</h2>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full">
                      <div className="pl-10">
                        <div className="grid grid-cols-2 @[30rem]:grid-cols-3 gap-3 ">
                          {item.permissionsAsAssessor?.map((element, index) => (
                            <div
                              className="border-b pb-3"
                              key={"Assessor" + index}
                            >
                              <div className="font-bold">
                                {element.evaluatorRole
                                  ? element.evaluatorRole.role_name
                                  : "Unknown Role"}
                              </div>
                              <div className="">
                                <div className="mt-1 flex items-center">
                                  <Dot strokeWidth={4} />
                                  <h2>ภายในกลุ่มงาน</h2>
                                </div>
                                <div className="ml-3 border-l border-gray-400 pl-2">
                                  {element.permissionForm.length ? (
                                    element.permissionForm // แสดงข้อมูลว่า Role นี้มีpermission ที่ใช้แบบฟอร์มตัวไหนบ้าง
                                      .filter((p) => p.ingroup == true)
                                      .map((form, index) => (
                                        <div key={"FormId" + index}>
                                          - {form.form.name}
                                        </div>
                                      ))
                                  ) : (
                                    <div>
                                      <h2 className="text-red-500">
                                        ไม่ได้กำหนด
                                      </h2>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center">
                                  <Dot strokeWidth={4} />
                                  <h2>ภายนอกกลุ่มงาน</h2>
                                </div>
                                <div className="ml-3 border-l border-gray-400 pl-2">
                                  {element.permissionForm.length ? (
                                    element.permissionForm // แสดงข้อมูลว่า Role นี้มีpermission ที่ใช้แบบฟอร์มตัวไหนบ้าง
                                      .filter((p) => p.ingroup == false)
                                      .map((form, index) => (
                                        <div key={"FormId" + index}>
                                          - {form.form.name}
                                        </div>
                                      ))
                                  ) : (
                                    <div>
                                      <h2 className="text-red-500">
                                        ไม่ได้กำหนด
                                      </h2>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-md mt-3">
                          <span className="font-bold">Description :</span>{" "}
                          {item.description}
                        </p>
                      </div>
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
                                คุณแน่ใจแล้วใช่ไหมฦ
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-red-500">
                                การดำเนินการนี้ไม่สามารถย้อนกลับได้
                                การดำเนินการนี้จะลบตำแหน่งนี้
                                ออกจากเซิร์ฟเวอร์ของเรา
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteRole(item.id)}
                              >
                                ยืนยัน
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                          <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 px-2 h-9 active:scale-95">
                              <Settings2 size={18} /> กำหนดสิทธิ์
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>
                                <div className="flex gap-2 items-center">
                                  <div className="block p-1 bg-blue-100 rounded-full">
                                    <ShieldPlus
                                      size={40}
                                      className="text-blue-500"
                                    />
                                  </div>
                                  <h2 className="text-xl">ตั้งค่าตำแหน่ง</h2>
                                </div>
                              </DialogTitle>
                              <DialogDescription>
                                ตั้งค่าตำแหน่งและกำหนดสิทธิ์ต่างๆในการใช้แบบฟอร์มการประเมิน
                              </DialogDescription>
                            </DialogHeader>
                            <EditRoleDialog
                              role={item} //ส่งค่า item ซึ่งเป็นข้อมูลของ role ปัจจุบันที่กำลังถูกแก้ไขไปยัง EditRoleDialog component
                              onUpdate={onUpdate} //ส่งฟังก์ชัน onUpdate ไปให้ EditRoleDialog เพื่อให้ component นี้เรียกใช้งานเมื่อต้องการอัปเดตข้อมูล role
                              permissions={permissions} //ค่า permissions นี้ช่วยให้ component รู้ว่า permissions ที่มีอยู่ในระบบมีอะไรบ้าง เพื่อให้ผู้ใช้สามารถจัดการ permissions ได้
                              handleFilterChange={handleFilterChange} //ส่งฟังก์ชัน handleFilterChange ไปยัง EditRoleDialog เพื่อให้ component นี้สามารถแจ้งกลับไปยัง component หลักเมื่อมีการเปลี่ยนแปลงค่าที่ใช้ในการกรอง (filter) รายการต่าง ๆ
                              roles={roles} //ส่งค่า roles ซึ่งเป็นข้อมูลรายการของทุก role ที่มีอยู่ในระบบไปยัง EditRoleDialog
                              loading={loading}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default ManageRole;
