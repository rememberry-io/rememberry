"use client";
import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import { SidebarButton } from "../ui/SidebarButton";
import { Map, HelpCircle, Upload, Sticker, Hourglass } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Sidebar() {
  const sidebarElements = [
    { id: 1, label: "Flashcard map", icon: Map, link: "/map" },
    { id: 2, label: "How it works", icon: HelpCircle, link: "/tutorial" },
    { id: 3, label: "Upcoming features", icon: Hourglass, link: "/features" },
    { id: 4, label: "Give feedback", icon: Sticker, link: "/feedback" },
    { id: 5, label: "Upload content", icon: Upload, link: "/upload" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Wrapper */}
      <div className="space-y-4 py-4 flex flex-col text-white h-full">
        {/* Sidebar Header */}
        <div className="px-4 py-2 flex-row flex items-start justify-between">
          <div>
            <div className="relative">
              <Link
                href="/profile"
                className="flex items-center bg-red-100"
              ></Link>
              <Image
                width={32}
                height={32}
                alt="Rememberry logo"
                src="/blueberry.png"
              />
            </div>
          </div>
          <div>
            {/* SidebarButton as the Sheet trigger */}
            <SidebarButton />
          </div>
        </div>
        {/* Sidebar Links */}
        <div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="text-white font-medium">
              {sidebarElements.map((item) => (
                <li
                  className="flex flex-row items-center pl-6 hover:text-white hover:bg-white/10 rounded-lg transition"
                  key={item.id}
                >
                  <div>
                    <item.icon />
                  </div>
                  <div>
                    <Link
                      href={item.link}
                      className="flex items-center my-4 pl-6"
                    >
                      {" "}
                      {item.label}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="relative bg-cyan-700 overflow-hidden h-10 w-10">
        <Image
          src="/sample_profile_pic.png"
          layout="fill"
          objectFit="cover"
          alt="Profile Picture"
          className="rounded-full"
        />
      </div>
    </div>
  );
}
