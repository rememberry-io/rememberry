"use client";
import React from "react";
import { ModeToggle } from "../ui/ModeToggle";
import { SidebarButton } from "../ui/SidebarButton";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOpen, toggleSidebar }) => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const toggleSidebar = () => {
  //     setIsOpen(!isOpen);
  //   };
  return (
    <nav className="flex items-center justify-between gap-x-4 px-3 py-4">
      <SidebarButton isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <ModeToggle />
    </nav>
  );
};
