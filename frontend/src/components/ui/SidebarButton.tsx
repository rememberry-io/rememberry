"use client";
import React, { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SidebarButton({ isOpen, setIsOpen }: SidebarButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-[#] text-white"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? (
        <ChevronsLeft className="h-4 w-4" />
      ) : (
        <ChevronsRight className="h-4 w-4" />
      )}
    </Button>
  );
}
