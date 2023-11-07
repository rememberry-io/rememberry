"use client";
import { Header } from "@/components/Navigation/Header";
import Sidebar from "@/components/Navigation/Sidebar";
import React, { useState } from "react";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

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
        <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      </div>
      {children}
      {/* MapLayout will receive several React nodes as children that will be rendered in place here */}
    </div>
  );
}
