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






export default function Sidebar() {
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
			<div className="p-3">
				<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
					<div className="flex grow flex-col gapy-y-5 overflow-y-auto px-6 pb-4">
						<SidebarHeader />
							<nav className="flex flex-1 flex-col">
								<ul role="list" className="text-white">
									{sidebarElements.map((item) => {
										return <div key={item.id}><Link href={item.link}>{item.label}</Link></div>
									})}
								</ul>

						</nav>
					<div>

					</div>
				</div>

			</div>
					
			</div>
		</div>
	);
}