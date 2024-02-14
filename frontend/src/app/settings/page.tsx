//profile page

// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import "reactflow/dist/style.css";

function Settings() {
  return (
    <div className="relative">
      <FlowBackground />
      <div className="z-10 absolute top-0 left-0 w-full h-screen">
        <FlowFooter>
          <>
            <Link href={"/map"}>
              <Button className="flex items-center ">
                <span>Go to Map</span>
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            {/* <Button onClick={openAddDialog}>Add Map</Button> */}
          </>
        </FlowFooter>
      </div>
    </div>
  );
}

export default Settings;
