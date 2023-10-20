import React from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/_components/ui/button"
  

export const DropDown = () => {
  return (
	<DropdownMenu>
 		<DropdownMenuTrigger>
			<Button variant="secondary">Actions</Button>
		</DropdownMenuTrigger>
  		<DropdownMenuContent>
    		<DropdownMenuLabel>My Account</DropdownMenuLabel>
    		<DropdownMenuSeparator />
    		<DropdownMenuItem>Profile</DropdownMenuItem>
    		<DropdownMenuItem>Billing</DropdownMenuItem>
    		<DropdownMenuItem>Team</DropdownMenuItem>
    		<DropdownMenuItem>Subscription</DropdownMenuItem>
  		</DropdownMenuContent>
</DropdownMenu>

  )
}
