import { DropDown } from "@/components/Flow/Header/DropDown";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { SidebarButton } from "@/components/ui/SidebarButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Panel } from "reactflow";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  mapName: string;
  openHandler: () => void;
}

export const FlowHeader: React.FC<HeaderProps> = ({
  isOpen,
  toggleSidebar,
  mapName,
  openHandler,
}) => {

  //Todo: on sidebar open, show maps
  
  return (
    <Panel
      position="top-center"
      style={{
        justifyContent: "space-between",
        width: "95%",
        paddingTop: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex gap-5">
          <SidebarButton
            isOpen={isOpen}
            toggleSidebar={openHandler}
          />
          <Link href="/">
            <Button variant="outline" className="p-3">
              🫐 <p className="ml-2 text-sm">{mapName}</p>
            </Button>
          </Link>
        </div>
        <div className="flex gap-5">
          <DropDown />
          <ModeToggle />
        </div>
      </div>
    </Panel>
  );
};
