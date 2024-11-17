import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
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
import { FormQuestion } from "@/types/interface";
const formSchema = z.object({
  content: z
    .string()
    .min(10, { message: "massage must be at least 10 characters." }) // ขั้นต่ำ 10 ตัวอักษร
    .max(100, { message: "massage must not exceed 100 characters." }),
});
// 2. กำหนด type จาก schema
type FormValues = z.infer<typeof formSchema>;

interface EditQuestionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: FormQuestion;
  onUpdate: (values: FormValues) => Promise<void>;
}

const EditQuestionDialog = ({
  open,
  setOpen,
  question,
  onUpdate,
}: EditQuestionDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: question.content,
    },
  });
  // 2. handleSubmit function ใน EditQuestionDialog
  const handleSubmit = async (values: FormValues) => {
    try {
      // ส่งข้อมูลที่แก้ไขไปยัง parent component ผ่าน onUpdate prop
      await onUpdate(values);
      // หลังจาก update สำเร็จ ปิด Dialog
      setOpen(false);
    } catch (error) {
      // จัดการ error กรณีที่ update ไม่สำเร็จ
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Make changes to your question here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-4 py-4">
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="message-2">Your Content</Label>
                        <Textarea
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionDialog;
