import { DropDown } from "@/components/Flow/FlowHeader/DropDown";
import { MainStack } from "@/components/Flow/StackComponents/MainStack";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Panel } from "reactflow";

export const FlowHeader = () => {
  const frontText = "1st year medicine @Charite";
  const backText = "Jehfbsjhdbf";

  const [isFront, setIsFront] = useState(true);

  const toggleMainStack = useCallback(() => {
    setIsFront((prevIsFront) => !prevIsFront);
  }, []);
  return (
    <Panel position="top-center">
      <div className="flex flex-row items-center justify-around">
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
      </div>
    </Panel>
  );
};
