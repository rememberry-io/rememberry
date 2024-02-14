import FlowBackground from "@/components/Flow/Background/flowBackground";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative">
      <FlowBackground />

      <div className="z-10 absolute top-0 left-0 w-full h-full  flex items-center justify-center">
        <div className="z-10 relative flex flex-col items-center justify-center min-h-screenrounded-md  gap-5">
          <h1 className=" text-2xl font-semibold  text-primary">
            Did you not REMEMBERRY your page? 🫣
          </h1>
          <p className="">Don't worry, we'll guide you back 🫐</p>
          <div>
            <Button>
              <Link href="/">Jump to home screen</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
