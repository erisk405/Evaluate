import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GitFork } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlobalApi from "@/app/_util/GlobalApi";
import useStore from "@/app/store/store";
import { formStates, Role } from "@/types/interface";
import { toast } from "sonner";
type FormLevelEditPageProp = {
  formItem: formStates;
  fetchForm: () => void;
};
const FormLevelEditPage = ({ formItem, fetchForm }: FormLevelEditPageProp) => {
  const { roles, setRole } = useStore();
  // สร้างค่าเริ่มต้นของ stackFormLevel จาก roles ทันทีใน useState

  // เปลี่ยนเป็นฟังก์ชันเพื่อสร้าง initial state
  const createInitialStackFormLevel = (roles: Role[]) => {
    return roles.reduce((acc: any, role: Role) => {
      // ครอบคลุมทุก role ยกเว้น admin และ member
      if (role.role_name !== "admin" && role.role_name !== "member") {
        // Find the matching roleFormVision for this role in formItem
        const matchingRoleFormVision = formItem.roleFormVision.find(
          // ใช้เพื่อต้องการจะนำ defualt value ของมันมาเติม
          (rfv) => rfv.visionRole.id === role.id
        );
        acc[role.role_name] = {
          role_id: role.id,
          visionLevel: matchingRoleFormVision?.level || "UNSET", // ค่าเริ่มต้นเป็น VISION_1
        };
      }
      return acc;
    }, {});
  };
  const [stackFormLevel, setStackFormLevel] = useState<{
    [key: string]: {
      role_id: string;
      visionLevel: "VISION_1" | "VISION_2" | "UNSET";
    };
  }>({});

  // เพิ่ม state เก็บค่าเริ่มต้นของ stackFormLevel เพราะเดี๋ยวจะเอาไปเทียบกับ stackFormLevel ว่าต่างกันมั้ย
  const [initialStackFormLevel, setInitialStackFormLevel] = useState<{
    [key: string]: {
      role_id: string;
      visionLevel: "VISION_1" | "VISION_2" | "UNSET";
    };
  }>({});

  const isFormUnchanged = useMemo(() => {
    return (
      JSON.stringify(stackFormLevel) === JSON.stringify(initialStackFormLevel)
    );
  }, [stackFormLevel, initialStackFormLevel]);

  const showToast = (title: string, description: string) => {
    toast(title, { description });
  };
  const handleApiError = (error: any, message: string) => {
    console.error({ message: error });
    toast("เกิดข้อผิดพลาด", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(error?.response?.data?.message, null, 2)}
          </code>
        </pre>
      ),
    });
  };
  const handleFormLevelChange = (
    roleName: string,
    roleId: string,
    visionLevel: "VISION_1" | "VISION_2" | "UNSET"
  ) => {
    setStackFormLevel((prev: any) => ({
      ...prev,
      [roleName]: { role_id: roleId, visionLevel },
    }));
  };
  const handleSaveChanges = async (formId: string) => {
    try {
      const payload = {
        formId: formId,
        stackFormLevel: Object.values(stackFormLevel).map((level) => ({
          role_id: level.role_id,
          visionLevel: level.visionLevel,
        })),
      };

      const response = await GlobalApi.updateVisionOfForm(payload);
      if (!response) {
        throw new Error("Can not updated vision form.");
      }
      showToast("อัพเดทVision Form สำเร็จ", `ระบบได้ save Vision form นี้แล้ว`);
      // console.log("response", response);
      // console.log("payload", payload);
      // อัพเดทค่า initialStackFormLevel หลังจาก save สำเร็จ 
      setInitialStackFormLevel(stackFormLevel);
    } catch (error) {
      handleApiError(error, "Error while update vision");
    }
  };

  useEffect(() => {
    const initialfetchRole = async () => {
      try {
        const response = await GlobalApi.getRole();
        // update Role เมื่อมีการอัพเดท
        setRole(response?.data);
      } catch (error) {
        console.log({ messsage: error });
      }
    };
    if (!(roles.length > 0)) initialfetchRole();
  }, []);
  useEffect(() => {
    if (roles.length > 0) {
      const initialState = createInitialStackFormLevel(roles);
      setStackFormLevel(initialState);
      setInitialStackFormLevel(initialState);
    }
  }, [roles]);

  return (
    <div className="col-span-3 relative h-[430px] pl-7">
      <h2 className="text-lg font-medium">Form Level</h2>
      <p className="text-sm text-gray-500">
        ใช้ในการตรวจสอบและกำหนด
        การมองเห็นของฟอร์มเมื่อเช็คผลประเมินของแต่ละผู้ใช้งานนั้น
      </p>
      <Separator className="shrink-0 h-[0.5px] w-full col-span-4 bg-gray-200 my-4" />{" "}
      <p className="text-sm">ตำแหน่งที่สามารถกำหนดได้</p>
      <div className="grid grid-cols-1 ">
        <ScrollArea className="max-h-[280px] rounded-md">
          {roles &&
            roles.map(
              (role: Role) =>
                role.role_name !== "admin" &&
                role.role_name !== "member" && (
                  <div className="grid grid-cols-3 px-5 mt-2" key={role.id}>
                    <div className="col-span-2 flex items-center w-full gap-2">
                      <div className="rounded-full bg-blue-50 p-2">
                        <GitFork className="text-blue-500" />
                      </div>
                      <h2 className="text-sm">{role.role_name}</h2>
                    </div>
                    <Select
                      value={
                        (stackFormLevel[role.role_name]
                          ?.visionLevel as string) || undefined
                      }
                      onValueChange={(
                        value: "VISION_1" | "VISION_2" | "UNSET"
                      ) =>
                        handleFormLevelChange(role.role_name, role.id, value)
                      }
                    >
                      <SelectTrigger className="w-full px-2">
                        <SelectValue placeholder="Select a vision " />
                      </SelectTrigger>
                      <SelectContent className="p-0">
                        <SelectItem value="UNSET">ยังไม่ได้กำหนดค่า</SelectItem>
                        <SelectItem value="VISION_1">เห็นผลโดยรวม</SelectItem>
                        <SelectItem value="VISION_2">
                          จำแนกแต่ละหน่วยงาน
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
            )}
        </ScrollArea>
      </div>
      <div className="absolute bottom-0 right-0">
        <Button
          type="submit"
          onClick={() => handleSaveChanges(formItem.id)}
          disabled={isFormUnchanged}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default FormLevelEditPage;
