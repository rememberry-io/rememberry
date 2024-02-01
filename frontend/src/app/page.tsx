// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import useAutosizeTextArea from "@/components/Flow/hooks/useAutosizeTextArea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Box, Flex } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import "reactflow/dist/style.css";
import { useStore } from "../components/Flow/stores/mapStore";

function MapMenu() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { addMap, categories, removeMap } = useStore();

  const sortedMaps = categories.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const mapCards = sortedMaps.map((map) => (
    <>
      <Card className="dark:bg-dark-600 max-w-xs" key={map.id}>
        <Flex gap="3" align="center">
          <Box>
            <Link href={"/map"}>
              <button>
                <div className="p-3  rounded-lg m-10">{map.name}</div>
                <div className="p-3  rounded-lg m-10">{map.description}</div>
              </button>
            </Link>
          </Box>
        </Flex>
      </Card>
    </>
  ));

  const openNamingDialog = () => {
    setOpenDialog(true);
  };

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(descriptionRef.current, description);

  const handleDescriptionChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const valFront = evt.target?.value;

    setDescription(valFront);
  };

  return (
    <div className="relative">
      <FlowBackground />
      <div className="z-10 absolute top-0 left-0 w-full h-screen">
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
          <DialogContent onAbort={() => setOpenDialog(false)}>
            <div>
              <div>
                <h1 className="text-2xl font-medium max-w-xl text-blackberry dark:text-white">
                  What do you want to call it?
                </h1>
                <input
                  className="mt-5 bg-slate-50 dark:bg-dark-600  rounded-md h-fit p-2 outline-none resize-none w-full break-words "
                  placeholder="Map Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  className="mt-5 bg-slate-50 dark:bg-dark-600  rounded-md h-fit p-2 outline-none resize-none w-full break-words "
                  placeholder="Description"
                  value={description}
                  ref={descriptionRef}
                  rows={1}
                  onChange={handleDescriptionChange}
                />
              </div>

              <div className="leading-6 text-justify"></div>
              <Button
                className="mt-4"
                onClick={() => {
                  addMap(name);
                  setOpenDialog(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div id="header"></div>
        <div id="body" className="flex content-start p-20">
          {mapCards}
        </div>
        <div className="fixed inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4">
            <Link href={"/map"}>
              <Button className="flex items-center ">
                <span>Go to Map</span>
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button onClick={openNamingDialog}>Add Map</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapMenu;
