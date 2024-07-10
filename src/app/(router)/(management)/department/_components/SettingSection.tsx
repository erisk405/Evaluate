import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cog } from "lucide-react";
import Image from "next/image";
import SetStatusSection from "./SetStatusSection";

export default function SettingSection() {
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
        <div>
          <div className="flex justify-center mt-3">
            <Image
              src={"/test.png"}
              width={300}
              height={300}
              alt="ProfileDepartment"
              className="w-[250px] h-[250px] object-cover rounded-xl"
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" defaultValue={'My Edit name'} className="col-span-3" />
            </div>
          </div>
          <div className="my-4">
            <h2 className="font-bold">Team Members</h2>
            <p className="text-sm text-neutral-500">
              Invite your team members to collaborate.
            </p>
            <div className="px-10 my-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src={"/profiletest.jpg"}
                  width={50}
                  height={50}
                  alt="ProfileDepartment"
                  className="w-[40px] h-[40px] object-cover rounded-full"
                />
                <ul className="text-sm">
                  <li>Krittaphat Samrit</li>
                  <li className="text-neutral-500">copter1177@gmail.com</li>
                </ul>
              </div>
              <div><SetStatusSection/></div>
            </div>
            <hr />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
