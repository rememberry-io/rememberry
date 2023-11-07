import { LogOut } from "lucide-react";
import Link from "next/link";

export const SignOutButton = () => {
  return (
    <div>
      <Link href="/">
        <LogOut />
      </Link>
    </div>
  );
};
