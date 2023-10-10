'use client'
import React, { useState } from "react";
import classNames from "classnames";
import {
	DashboardIcon,
	CreateIcon,
	MapIcon,
	UploadIcon,
	TutorialIcon
} from "../icons/index";
import SidebarHeader from "./SidebarHeader";
import Link from 'next/link'
import styles from './Sidebar.module.css'






export default function Navbar() {
	const [toggleCollapse, setToggleCollapse] = useState(false);
	const [isCollapsible, setIsCollapsible] = useState(false);

	const sidebarElements = [
		{ id: 1, label: "Flashcard map", icon: CreateIcon, link: "/map", current: true},
		{ id: 2, label: "How it works", icon: TutorialIcon, link: "/tutorial", current: false},
		{ id: 3, label: "Incoming features", icon: CreateIcon, link: "/features", current: false},
		{ id: 4, label: "Our mission", icon: TutorialIcon, link: "/mission", current: false},
		{ id: 5, label: "Give feedback", icon: TutorialIcon, link: "/feedback", current: false},
		{ id: 6, label: "Upload content", icon: UploadIcon, link: "/upload", current: false},
	]

	return (
		<div className="h-full relative">
			<div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-blue-500">
			</div>
			
		</div>

	)
}