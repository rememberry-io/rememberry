import { ChevronsLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SidebarButton() {
  return (
    <Button variant="outline" size="icon" className="bg-[#5A97F1]">
      <ChevronsLeft className="h-4 w-4" />
    </Button>
  )
}
