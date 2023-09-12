'use client'
import React, { useState } from "react";




export default function Sidebar() {
	const [toggleCollapse, setToggleCollapse] = useState(false);



	return (
		<div className="min-h-screen bg-blue-500 w-3/12">
			<div id="nav-wrapper" className="">
				<ul className="text-white">
					<li>
						Dashboard
					</li>
					<li>
						Create flashcards
					</li>
					<li>
						Flashcard map
					</li>
					<li>
						Upload content
					</li>
					<li>
						How it works
					</li>
				</ul>
			</div>
		</div>
	);
}