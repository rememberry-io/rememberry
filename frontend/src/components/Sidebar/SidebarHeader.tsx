'use client'

import React from 'react';
import Image from 'next/image'
import CollapseIcon from "../icons/CollapseIcon"

export default function SidebarHeader() {



	return (
		<div className='flex flex-row items-center justify-between'>
			<div id='profilepic' className='border'>
				<Image src="/blueberry.png" width={30} height={30} alt="Profile Picture"/>
			</div>
			<div id='name'>
				<p>Vorname Name</p>
			</div>
			<div id='burger-bar'>
				<button>
					<CollapseIcon />
				</button>
			</div>
		</div>
		
	)
}