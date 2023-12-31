"use client";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface SidebarButtonProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function SidebarButton({ isOpen, toggleSidebar }: SidebarButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-blue-700 text-white"
      onClick={toggleSidebar}
    >
      {isOpen ? (
        <ChevronsLeft className="h-4 w-4" />
      ) : (
        <ChevronsRight className="h-4 w-4" />
      )}
    </Button>
  );
}
