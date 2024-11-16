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
    .min(5, { message: "Role name must be at least 5 characters." })
    .max(50, { message: "Role name must not exceed 50 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(100, { message: "Description must not exceed 100 characters." }),
  roleLevel: z.enum(["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4"], {
    required_error: "Please select a role level.",
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

  useEffect(() => {
    console.log("defaultPermissions", role.permissionsAsAssessor); // สามารถใช้ เป็น defaultValue ของ Permissions ได้
  }, []);
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
                <FormLabel>Role name</FormLabel>
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
                <FormLabel>Role level</FormLabel>
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
                    <SelectItem value="LEVEL_1">Level 1</SelectItem>
                    <SelectItem value="LEVEL_2">Level 2</SelectItem>
                    <SelectItem value="LEVEL_3">Level 3</SelectItem>
                    <SelectItem value="LEVEL_4">Level 4</SelectItem>
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
          <h2>Set role permission form evaluate</h2>
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
                                permission.evaluatorRole.id === item.id
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
                                permission.evaluatorRole.id === item.id
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
                <Textarea {...field} placeholder="Type your message here." />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Your message will be copied to the description role.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        {!loading ? (
          <Button type="submit">Save Change</Button>
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
