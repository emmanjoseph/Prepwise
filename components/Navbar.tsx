"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser, Logout } from "@/lib/actions/auth.action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function getInitials(name: string): string {
  const words = name.trim().split(" ");
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase(); // First letter of first two words
  }
  return name.substring(0, 2).toUpperCase(); // First two letters if only one word
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await Logout();
    router.push("/sign-in"); // Redirect to sign-in page after logout
  };

  return (
    <nav className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={38} height={32} />
        <h2 className="text-primary-100 text-xl font-bold">Prepwise</h2>
      </Link>

      <div className="text-light-100">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarFallback className="text-sm font-bold">
                {getInitials(user?.name || "UN")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark-gradient">
            <DropdownMenuLabel>
              <div className="px-10 flex flex-col justify-start py-1">
                <p className="text-base">{user?.name}</p>
                <span className="text-xs">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                className="w-full bg-red-500 text-white cursor-pointer hover:text-dark-100 rounded-3xl h-12"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
