"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import { SidebarButton } from "@/components/ui/SidebarButton";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-full relative">
      {/* <div
        className={`h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] right-shadow ${
          !isOpen && "hidden"
        }`}
      > */}
      <div>
        <Sidebar />
      </div>
      {/* MapLayout will receive several React nodes as children that will be rendered in place here */}
      {children}
    </div>
  );
}
