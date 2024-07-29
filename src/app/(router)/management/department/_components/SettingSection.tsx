import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cog, Search } from "lucide-react";
import Image from "next/image";
import ListTeamOfDepartment from "./ListTeamOfDepartment";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { any, z } from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import axios from "axios";
import { Department } from "@/types/interface";
import { apiUrl } from "@/app/data/data-option";
import { useEffect } from "react";
import GlobalApi from "@/app/_unit/GlobalApi";

const formSchema = z.object({
  name:z.string().min(1,{message:"Name is required"}),
  image:z.any().optional()
});
interface SettingSectionProps {
  department: Department; // Replace 'string' with the appropriate type for departmentId
}
export default function SettingSection({department}:SettingSectionProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:department.department_name,
      image:undefined,
    }
  });
  
  
  const onSubmit=async (values:z.infer<typeof formSchema>)=>{
    console.log(values);
    // console.log(department);
    try {
      if(values.image){
        const formData = new FormData();
        formData.append('image',values.image as File)
        const response = await GlobalApi.updateDepartmentImage(formData,department);
        console.log('responseChangeImage',response);
        
      }
      if(values.name != department.department_name){
        console.log('old name');
        
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Cog scale={13} /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
          <SheetDescription>
            Make changes to your Department here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit = {form.handleSubmit(onSubmit)}>
          <div>
            <div className="flex justify-center mt-3">
              {department.image ?
                (
                  <Image
                    src={department.image.url}
                    width={400}
                    height={300}
                    alt="ProfileDepartment"
                    className="w-[350px] h-[200px] object-cover rounded-xl"
                  />
                )
                :
                (
                  <Image
                    src={'/test.png'}
                    width={400}
                    height={300}
                    alt="ProfileDepartment"
                    className="w-[350px] h-[200px] object-cover rounded-xl"
                  />
                )
              }
            </div>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          {...field}
                          className="col-span-2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              
              />
               <FormField
                control={form.control}
                name="image"
                render={({field})=>(
                  <FormItem>
                    <FormControl>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        image
                      </Label>
                      <Input id="image" onChange={(e)=>{field.onChange(e.target.files?.[0])}} type="file" className="col-span-2"
                     />
                    </div>
                     
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              
              />
             
              
            </div>
            <div className="my-4">
              <h2 className="font-semibold ">Team Members</h2>
              <p className="text-sm text-neutral-500">
                Invite your team members to collaborate.
              </p>
              <div className="flex justify-end">
                <div className="flex-1 max-w-[250px] relative my-2">
                  <Input type="search" placeholder="Search" className="pl-9" />
                  <div className="">
                    <Search
                      size={18}
                      className="absolute  top-1/2 left-0 -translate-y-1/2 translate-x-1/2 text-gray-500"
                    />
                  </div>
                </div>
                <div></div>
              </div>
              {/* List Team of department */}
              
          <Button type="submit">Save changes</Button>
              <div>
                <ListTeamOfDepartment department={department} />
              </div>
            </div>
          </div>
          </form>
        </Form>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
