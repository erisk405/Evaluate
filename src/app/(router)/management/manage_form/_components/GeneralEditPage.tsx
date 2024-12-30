import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formStates } from "@/types/interface";
import GlobalApi from "@/app/_util/GlobalApi";
import { toast } from "sonner";

const formSchema = z.object({
  formName: z
    .string()
    .min(5, { message: "form name must be at least 5 characters." }) // ขั้นต่ำ 5 ตัวอักษร
    .max(50, { message: "form name must not exceed 50 characters." }), // สูงสุด 50 ตัวอักษร
});
type GeneralEditPageProp = {
  formItem: formStates;
  fetchForm: () => void;
};
const GeneralEditPage = ({ formItem, fetchForm }: GeneralEditPageProp) => {
  // set ค่า defualt
  const [initialValue, setInitialValue] = useState(formItem.name);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formName: formItem.name,
    },
  });

  const currentValue = form.watch("formName");
  const isFormUnchanged = currentValue === initialValue;

  const showToast = (title: string, description: string) => {
    toast(title, { description });
  };
  // ที่ต้องใช้ handleSubmit ที่เรียกจาก function แบบนี้ เพราะเราอยากได้ id จาก formState มาด้วยจึงต้องทำแยก
  const handleSaveChanges = (formId: string) => {
    form.handleSubmit((values) => onSubmit(values, formId))();
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
  // onSubmit ของ Edit form ในการเปลี่ยนชื่อ
  const onSubmit = async (
    values: z.infer<typeof formSchema>,
    formId: string
  ) => {
    try {
      const data = {
        id: formId,
        name: values.formName,
      };
      // console.log("values", values);
      const response = await GlobalApi.updateForm(data);
      showToast("อัพเดทชื่อฟอร์มสำเร็จ", `updated to ${response?.data.name}`);
      setInitialValue(values.formName); // Update the initial value after successful submission

      fetchForm();
    } catch (error) {
      console.error({ message: error });
      handleApiError(error, "Error while update form");
    }
  };
  return (
    <div className="col-span-3 h-[430px]">
      <h2 className="text-lg font-medium">General</h2>
      <p className="text-sm text-gray-500">
        ชื่อของแบบฟอร์มจะส่งผลกับการ Export เอกสารด้วย โปรดตรวจสอบให้แน่ใจ
      </p>
      <Separator className="shrink-0 h-[0.5px] w-full col-span-4 bg-gray-200 my-3" />
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2 ">
            <div className="">
              <FormField
                control={form.control}
                name="formName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Name</Label>
                    <FormControl>
                      <Input id="name" className="col-span-3 mt-2" {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Your message will be copied to the describtion role.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="mt-3"
              onClick={() => handleSaveChanges(formItem.id)}
              disabled={isFormUnchanged || !form.formState.isValid}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default GeneralEditPage;
