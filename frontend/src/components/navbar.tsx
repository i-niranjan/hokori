import React from "react";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImCommand } from "react-icons/im";
import { Button } from "./ui/button";
import { TbQuestionMark } from "react-icons/tb";
export default function Navbar() {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-100 h-15 mt-4 mr-4 rounded-xl flex justify-between items-center px-4 py-1">
      <div className="">
        <div className="relative w-full max-w-sm bg-white rounded-2xl ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 rounded-2xl"
          />
          <Badge
            className="absolute right-3 bg-neutral-200 top-1/2 -translate-y-1/2  w-max h-5"
            variant="secondary"
          >
            <ImCommand />F
          </Badge>
        </div>
      </div>
      <div className=" flex gap-4 items-center">
        <Button variant={"outline"} className="rounded-full" size={"icon"}>
          <TbQuestionMark size={22} />
        </Button>
        <Button variant={"outline"} className="rounded-full" size={"icon"}>
          <Bell size={22} />
        </Button>
        <div className="flex gap-2 items-center">
          <Avatar className="size-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Niranjan Chaudhari</p>
            <p className="text-neutral-500 text-xs">
              niranjanchaudhari2004@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
