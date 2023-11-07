import { DropDown } from "@/components/Flow/FlowHeader/DropDown";
import { MainStack } from "@/components/Flow/StackComponents/MainStack";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { SidebarButton } from "@/components/ui/SidebarButton";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Panel } from "reactflow";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const FlowHeader: React.FC<HeaderProps> = () => {
  const frontText = "1st year medicine @Charite";
  const backText = "Jehfbsjhdbf";

  const [isFront, setIsFront] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMainStack = useCallback(() => {
    setIsFront((prevIsFront) => !prevIsFront);
  }, []);
  return (
    <Panel
      position="top-center"
      style={{
        justifyContent: "space-between",
        width: "100%",
        paddingTop: "20px",
      }}
    >
      <div className="flex flex-row items-center justify-around">
        <SidebarButton
          isOpen={isOpen}
          toggleSidebar={() => setIsOpen(!isOpen)}
        />
        <Link href="/map/menu">
          <Button variant="ghost">
            <ArrowLeftCircle className="mr-2" />
            Back to menu
          </Button>
        </Link>
        <MainStack
          frontText={frontText}
          backText={backText}
          toggleMainStack={toggleMainStack}
          isFront={isFront}
        />
        <DropDown />
        <ModeToggle />
      </div>
    </Panel>
  );
};
