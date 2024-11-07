// UpdateRole.tsx
import React, { useEffect, useState } from "react";
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
import { BadgeCheck } from "lucide-react";
import EditRoleDialog from "./EditRoleDialog";
import useStore from "@/app/store/store";
import GlobalApi from "@/app/_unit/GlobalApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Settings2, ShieldPlus } from "lucide-react";
// Define the type for a single permission
type Permission = {
  internal: string[];
  external: string[];
};

// Define the type for the permissions state
type Permissions = {
  [key: string]: Permission;
};
const UpdateRole = () => {
  const { roles, setRole } = useStore();

  //accumulator (หรือ acc) คือค่าเริ่มต้นที่เราให้ใน reduce (ในที่นี้คือ {}) และจะถูกอัปเดตเรื่อย ๆ ในแต่ละรอบการวนลูป
  //currentValue (หรือ role) คือค่าใน array ที่เรากำลังประมวลผลในรอบนั้น ๆ.
  //initialValue คือค่าที่กำหนดเริ่มต้นให้กับ accumulator ซึ่งในกรณีนี้คือ {} as Permissions หมายถึง object เปล่า.
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

  const onUpdate = async (values: any, id: string) => {
    try {
      const data = {
        assessorId: id,
        permissions,
      };
      const response = await GlobalApi.testupdate(data);
      console.log(response);
    } catch (error) {
      console.error({ message: error });
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const response = await GlobalApi.deleteRole(id);
      // อัพเดท roles ใน store หลังจากลบสำเร็จ
      const updatedRoles = roles.filter((role) => role.id !== id);
      setRole(updatedRoles);
      // อัพเดท permissions state ด้วย
      setPermissions((prevPermissions) => {
        const { [id]: deletedRole, ...restPermissions } = prevPermissions;
        return restPermissions;
      });
    } catch (error) {
      console.error({ message: error });
    }
  };

  // function ที่ใช้ เพื่อประกอบ JSON ออกมาแล้ว ส่งไปอัพเดท
  const handleFilterChange = (
    roleID: string,
    roleName: string, // อััพเดทที่ role id อะไร
    type: "internal" | "external", //ภายในหรือภายนอกหน่วยงาน จะถูกนำมาเป็น key แล้วเอาform id มาใส่
    newValues: string[] // id ของแบบฟอร์ที่ส่งมาจาก Server
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [roleName]: {
        ...prev[roleName], // ถ้าไม่คัดลอกค่าเดิมไว้ ตอนSet formของroleอื่นใหม่ค่าเก่ามันจะหาย
        ["id"]: roleID, // ต้องการ id ของ role ที่เป็น evaluator
        [type]: newValues, // ต้องนำid ของform กลับมาว่าอยู่ภายนอกหรือภายในแล้ว id อะไร
      },
    }));
  };

  useEffect(() => {
    console.log("roles:", roles);
  }, [roles]);
  return (
    <div className="flex flex-col">
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
                            <AlertDialogAction
                              onClick={() => deleteRole(item.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2 px-2 h-9 active:scale-95">
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
                                    className="text-blue-500"
                                  />
                                </div>
                                <h2 className="text-xl">Edit role</h2>
                              </div>
                            </DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>

                          <EditRoleDialog
                            role={item} //ส่งค่า item ซึ่งเป็นข้อมูลของ role ปัจจุบันที่กำลังถูกแก้ไขไปยัง EditRoleDialog component
                            onUpdate={onUpdate} //ส่งฟังก์ชัน onUpdate ไปให้ EditRoleDialog เพื่อให้ component นี้เรียกใช้งานเมื่อต้องการอัปเดตข้อมูล role
                            permissions={permissions} //ค่า permissions นี้ช่วยให้ component รู้ว่า permissions ที่มีอยู่ในระบบมีอะไรบ้าง เพื่อให้ผู้ใช้สามารถจัดการ permissions ได้
                            handleFilterChange={handleFilterChange} //ส่งฟังก์ชัน handleFilterChange ไปยัง EditRoleDialog เพื่อให้ component นี้สามารถแจ้งกลับไปยัง component หลักเมื่อมีการเปลี่ยนแปลงค่าที่ใช้ในการกรอง (filter) รายการต่าง ๆ
                            roles={roles} //ส่งค่า roles ซึ่งเป็นข้อมูลรายการของทุก role ที่มีอยู่ในระบบไปยัง EditRoleDialog
                            defaultPermissions={item.permissionsAsAssessor} //ส่งค่า permissionsAsAssessor ของ item ไปเป็นค่า default permissions สำหรับการแสดงผลใน EditRoleDialog
                          />
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
  );
};

export default UpdateRole;
