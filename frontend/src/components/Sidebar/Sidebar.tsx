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






export default function Sidebar() {
	const [toggleCollapse, setToggleCollapse] = useState(false);
	const [isCollapsible, setIsCollapsible] = useState(false);

	const sidebarElements = [
		{ id: 1, label: "Dashboard", icon: DashboardIcon, link: "/dashboard"},
		{ id: 2, label: "Create Flashcard", icon: CreateIcon, link: "/create"},
		{ id: 3, label: "Map", icon: MapIcon, link: "/map"},
		{ id: 4, label: "Upload content", icon: UploadIcon, link: "/upload"},
		{ id: 5, label: "How it works", icon: TutorialIcon, link: "/tutorial"}
	]

	const wrapperClass = classNames(
		"min-h-screen bg-blue-500 w-64 px-4 pt-8 pb-4 flex flex-col",
		{
			['w-80']: !toggleCollapse,
			['w-20']: toggleCollapse
		}
	);
	const collapseIconClass = classNames(
		"min-h-screen bg-blue-500 w-64 px-4 pt-8 pb-4 flex flex-col",
		{
			"rotate-180": toggleCollapse,
		}
	);

	return (
		<div className={wrapperClass}>
			<SidebarHeader />
			<div id="nav-wrapper" className="">
				<ul className="text-white border">

					{sidebarElements.map((item) => {
						return <div key={item.id}>
						<p>{item.label}</p>
						</div>
					})}
				</ul>
			</div>
		</div>
	);
}