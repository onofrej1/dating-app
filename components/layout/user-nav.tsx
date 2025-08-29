import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export default function UserNav() {
  return (
    <DropdownMenu>
      {" "}
      <DropdownMenuTrigger className="focus:outline-none focus:ring-[2px] focus:ring-offset-2 focus:ring-primary rounded-full">
        {" "}
        <Avatar>
          {" "}
          <AvatarFallback>AB</AvatarFallback>{" "}
        </Avatar>{" "}
      </DropdownMenuTrigger>{" "}
      <DropdownMenuContent>
        {" "}
        <DropdownMenuLabel>My Account</DropdownMenuLabel>{" "}
        <DropdownMenuSeparator />{" "}
        <DropdownMenuItem>
          {" "}
          <LogOut className="h-4 w-4" /> Logout{" "}
        </DropdownMenuItem>{" "}
      </DropdownMenuContent>{" "}
    </DropdownMenu>
  );
}
