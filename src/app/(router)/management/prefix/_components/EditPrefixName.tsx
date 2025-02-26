import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormQuestion, PrefixType } from "@/types/interface";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
const formSchema = z.object({
  prefix_name: z
    .string()
    .min(1, { message: "massage must be at least 10 characters." }) // ขั้นต่ำ 10 ตัวอักษร
    .max(30, { message: "massage must not exceed 100 characters." }),
});
// 2. กำหนด type จาก schema
type FormValues = z.infer<typeof formSchema>;

interface EditPrefixNameDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  prefix: PrefixType;
  onUpdate: (values: FormValues) => Promise<void>;
}
const EditPrefixName = ({
  open,
  setOpen,
  prefix,
  onUpdate,
}: EditPrefixNameDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix_name: prefix.prefix_name,
    },
  });
  // 2. handleSubmit function ใน EditQuestionDialog
  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // ส่งข้อมูลที่แก้ไขไปยัง parent component ผ่าน onUpdate prop
      await onUpdate(values);
      // หลังจาก update สำเร็จ ปิด Dialog
      setOpen(false);
    } catch (error) {
      // จัดการ error กรณีที่ update ไม่สำเร็จ
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit prefix name</DialogTitle>
          <DialogDescription>
            Make changes to your question here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="prefix_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="message-2">Your Content</Label>
                        <Input
                          placeholder="Type your content here."
                          id="message-2"
                          {...field}
                        />
                        <p className="text-sm text-muted-foreground">
                          Your message will be copied to the support team.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {" "}
                {isLoading ? (
                  <div className="px-6">
                    <Loader className="animate-spin" />
                  </div>
                ) : (
                  "บันทึกข้อมูล"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrefixName;
