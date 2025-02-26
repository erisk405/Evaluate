// EditRoleDialog.tsx
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings2, ShieldPlus, BadgeAlert, Loader } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormOption from "./FormOption";
import { Permission, Role } from "@/types/interface";
const formSchema = z.object({
  roleName: z
    .string()
    .min(5, { message: "ชื่อตำแหน่งต้องมีขั้นต่ำ 5 ตัวอักษร" })
    .max(50, { message: "ชื่อตำแหน่งมีสูงสุดได้ 50 ตัวอักษร" }),
  description: z
    .string()
    .min(10, { message: "คำอธิบายต้องมีขั้นต่ำ 10 ตัวอักษร" })
    .max(100, { message: "คำอธิบายไม่สามารถมีได้เกิน 100 ตัวอักษร" }),
  roleLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"], {
    required_error: "กรุณากำหนดระดับของตำแหน่งนี้",
  }),
});

interface EditRoleDialogProps {
  role: Role;
  onUpdate: (values: any, id: string) => void;
  permissions: any;
  handleFilterChange: (
    roleID: string,
    roleName: string,
    type: "internal" | "external",
    newValues: string[]
  ) => void;
  roles: any[];
  loading: boolean;
}

const EditRoleDialog = ({
  role,
  onUpdate,
  permissions,
  handleFilterChange,
  roles,
  loading,
}: EditRoleDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleName: role.role_name,
      description: role.description,
      roleLevel: role.role_level as
        | "LEVEL_1"
        | "LEVEL_2"
        | "LEVEL_3"
        | "LEVEL_4",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onUpdate(values, role.id))}
        className="grid gap-4 py-4 px-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="roleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อตำแหน่ง</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LEVEL_1">
                      Level 1 {"(ผู้ใช้งานทั่วไป)"}
                    </SelectItem>
                    <SelectItem value="LEVEL_2">
                      Level 2 {"(ดูผลของผู้ใช้งานอื่นที่ตนเองสังกัดอยู่ได้)"}
                    </SelectItem>
                    <SelectItem value="LEVEL_3">
                      Level 3 {"(กำกับดูแลหน่วยงานอื่นได้)"}
                    </SelectItem>
                    <SelectItem value="LEVEL_4">
                      Level 4 {"(ดูผลภาพรวมได้)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <hr />
        <div className="flex items-center gap-2 font-semibold">
          <BadgeAlert className="text-blue-500 bg-white rounded-full" />
          <h2>กำหนดแบบฟอร์มในแต่ละตำแหน่งเพื่อใช้งานการประเมินผล</h2>
        </div>
        {/* ------------------------------------- */}
        {/*           edit permission             */}
        {/* ------------------------------------- */}
        <div className="grid grid-cols-4 items-center shadow-inner p-2 gap-4 overflow-scroll h-[35dvh] scrollbar-gemini rounded-lg">
          {roles.map(
            (item) =>
              item.role_name !== "admin" &&
              item.role_name !== "member" && (
                <div className="col-span-2" key={item.id}>
                  <Label className="text-left col-span-2">
                    {item.role_name}
                  </Label>
                  <div className="w-full mt-2">
                    <div className="ml-4">
                      <h2 className="text-sm">ภายในกลุ่มงาน</h2>
                      <FormOption
                        defaultValues={
                          role.permissionsAsAssessor
                            ?.find(
                              (permission) =>
                                permission?.evaluatorRole?.id === item.id
                            )
                            ?.permissionForm.filter(
                              (form) => form.ingroup === true
                            )
                            .map((form) => form.form.id) || []
                        }
                        selectedValues={
                          permissions[item.role_name]?.internal || [] // เช็คว่าroleที่กำหนดนี้ formId ไหนที่ถูกเลือกไว้ใน internal
                        }
                        setSelectedValues={(newValues) =>
                          handleFilterChange(
                            item.id,
                            item.role_name,
                            "internal",
                            newValues // มันจะได้ id ของ form ต่อจากนั้นมันจะเก็บไว้ใน key ที่กำหนด คือ internal
                          )
                        }
                      />
                    </div>
                    <div className="ml-4 mt-2">
                      <h2 className="text-sm">ภายนอกกลุ่มงาน</h2>
                      <FormOption
                        defaultValues={
                          role.permissionsAsAssessor
                            ?.find(
                              (permission) =>
                                permission?.evaluatorRole?.id === item.id
                            )
                            ?.permissionForm.filter(
                              (form) => form.ingroup === false
                            )
                            .map((form) => form.form.id) || []
                        }
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="พิมพ์ข้อความที่นี่อย่างน้อย 10 ตัวอักษร" />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                สามารถอธิบายที่มาหรือขอบเขตของตำแหน่งนี้ได้
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        {!loading ? (
          <Button type="submit">บันทึกข้อมูล</Button>
        ) : (
          <Button className="animate-pulse" type="button">
            <Loader className="animate-spin" />
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EditRoleDialog;
