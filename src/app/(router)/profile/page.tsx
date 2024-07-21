"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { apiUrl } from "@/app/data/data-option";

const formSchema = z.object({
    image: z.instanceof(File).refine(file => file.size > 0, {
        message: "Please upload a file.",
    }),
});

export default function page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        image: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("image", values.image);

    const response = await axios.put(`${apiUrl}/usersImage`, formData, {
      withCredentials: true, // เพื่อให้ cookies ถูกส่งไปด้วย
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
      },
    });
    console.log(response.data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FileImage</FormLabel>
              <FormControl>
              <Input
                  id="picture"
                  type="file"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0]); // Set the first file from the FileList
                  }}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
