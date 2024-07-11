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
import { Cog, EllipsisVertical, Search, X } from "lucide-react";
import Image from "next/image";
import SetStatusSection from "./SetStatusSection";
import ListTeamOfDepartment from "./ListTeamOfDepartment";

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
              className="w-[200px] h-[200px] object-cover rounded-xl"
            />
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={"My Edit name"}
                className="col-span-2"
              />
            </div>
          </div>
          <div className="my-4">
            <h2 className="font-semibold ">Team Members</h2>
            <p className="text-sm text-neutral-500">
              Invite your team members to collaborate.
            </p>
            <div className="flex justify-end">
              <div className="flex-1 max-w-[250px] relative my-2">
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-9"
                />
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
            <div>
              <ListTeamOfDepartment />
            </div>
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
