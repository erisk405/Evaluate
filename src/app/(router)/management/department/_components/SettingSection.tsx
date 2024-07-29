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
import { ListEmployeeOfDepartment } from "./ListEmployeeOfDepartment";

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
    <Sheet >
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Cog scale={13} /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll scrollbar-gemini pb-10">
        <SheetHeader>
          <SheetTitle>Edit Department</SheetTitle>
          <SheetDescription>
            Make changes to your Department here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit = {form.handleSubmit(onSubmit)}>
          <div>
            <div className="flex justify-start items-end gap-3 my-5">
              {department.image ?
                (
                  <Image
                    src={department.image.url}
                    width={400}
                    height={300}
                    alt="ProfileDepartment"
                    className="w-[250px] h-[150px] object-cover rounded-xl"
                  />
                )
                :
                (
                  <Image
                    src={'/test.png'}
                    width={400}
                    height={300}
                    alt="ProfileDepartment"
                    className="w-[300px] h-[200px] object-cover rounded-xl"
                  />
                )
              }
              <div className=" grid gap-3">
                <FormField 
                  control={form.control}
                  name="name"
                  render={({field})=>(
                    <FormItem className="">
                      <FormControl>
                        <div className="grid grid-cols-4 items-center gap-2">
                          <Label htmlFor="name" className="text-left">
                            Name
                          </Label>
                          <Input
                            id="name"
                            {...field}
                            className="col-span-4"
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
                    <FormItem className="">
                      <FormControl >
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label htmlFor="image" className="text-left">
                          image
                        </Label>
                        <Input id="image" onChange={(e)=>{field.onChange(e.target.files?.[0])}} type="file" className="col-span-4"
                       />
                      </div>
                       
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                
                />
              </div>
            </div>
            <div className="my-4">
              <h2 className="font-semibold ">Team Members</h2>
              <p className="text-sm text-neutral-500">
                Invite your team members to collaborate.
              </p>
              {/* List Team of department */}
              
              <div className="">
                <ListEmployeeOfDepartment department={department} />
                {/* <ListTeamOfDepartment department={department} /> */}
              </div>
            </div>
          </div>
          <div className="fixed right-5 bottom-5">
            <Button type="submit">Save changes</Button>
          </div>
          </form>
        </Form>
        <SheetFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
