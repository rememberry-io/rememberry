// root page
import { Button } from "@/_components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function MapMenu() {
  return (
    <main className="bg-white">
      <div className="flex flex-col space-y-8 justify-center items-center h-screen">
        <h1 className="text-3xl font-medium max-w-xl text-black">
          Map Menu coming soon...
        </h1>
        <Link href={"/map"}>
          <Button className="flex items-center">
            <span>Go to Map</span>
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default MapMenu;
