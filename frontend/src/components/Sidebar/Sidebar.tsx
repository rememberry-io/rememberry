"use client";
import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import { SidebarButton } from "../ui/SidebarButton";
import { Map, HelpCircle, Upload, Sticker, Hourglass } from "lucide-react";

interface SidebarElement {
  id: number;
  label: String;
  icon: React.FC<any>;
  link: string;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarElements: SidebarElement[] = [
    { id: 1, label: "Flashcard maps", icon: Map, link: "/map" },
    { id: 2, label: "How it works", icon: HelpCircle, link: "/tutorial" },
    { id: 3, label: "Upcoming features", icon: Hourglass, link: "/features" },
    { id: 4, label: "Give feedback", icon: Sticker, link: "/feedback" },
    { id: 5, label: "Upload content", icon: Upload, link: "/upload" },
  ];

  return (
    <div
      className={classNames(
        "flex flex-col h-full text-white md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]",
        {
          "bg-blue-700": isOpen,
          [styles.closed]: !isOpen,
        }
      )}
    >
      <div
        className={classNames("space-y-4 py-4 flex flex-col h-full", {
          hidden: !isOpen,
        })}
      >
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
            <SidebarButton isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
        <div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="text-white font-small text-sm">
              {sidebarElements.map((item) => (
                <li
                  className="flex flex-row items-center pl-6 hover:text-white hover:bg-white/10 rounded-lg transition"
                  key={item.id}
                >
                  <div>
                    <item.icon className="stroke-2 w-6 h-6" />
                  </div>
                  <div>
                    <Link
                      href={item.link}
                      className="flex items-center my-4 pl-6"
                    >
                      {item.label}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* this div will take up the space to ensure that the container with the profile pic and name always stays at the bottom */}
        <div className="flex-grow"></div>
        <div className="w-full h-24 flex items-center">
          <div className="relative overflow-hidden h-8 w-8 mx-6">
            <Image
              src="/sample_profile_pic.png"
              layout="fill"
              objectFit="cover"
              alt="Profile Picture"
              className="rounded-full"
            />
          </div>
          <div className="text-sm mr-6 truncate max-w-xs">
            Leonardo Di Caprio
          </div>
        </div>
      </div>
    </div>
  );
}
