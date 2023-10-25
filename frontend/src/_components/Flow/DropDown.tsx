import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { Switch } from "@/_components/ui/switch";

export const DropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Switch />
          Subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
