// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUserStore } from "@/lib/services/authentication/userStore";
import useCreateMap from "@/lib/services/maps/useCreateMap";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import { Box, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useRef, useState } from "react";
import "reactflow/dist/style.css";
import useAutosizeTextArea from "@/components/Flow/hooks/useAutosizeTextArea";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

function MapMenu() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [description, setDescription] = useState("");
  const { isLoading, maps } = useGetMapByUserId();
  const createMap = useCreateMap();
  const userId = useUserStore((state) => {
    if (state.user) {
      return state.user.id;
    }
    return null;
  });

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(descriptionRef.current, description);

  if (isLoading) return null;

  const sortedMaps = maps.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const openNamingDialog = () => {
    setOpenDialog(true);
  };


  const handleDescriptionChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                onClick={async () => {
                  if (userId) {
                    const [_err, map] = await createMap({
                      map: {
                        name,
                        description,
                        userId: userId,
                      },
                    });

                    setOpenDialog(false);

                    if (map) {
                      router.push("/map/" + map.id);
                    }
                  } else {
                    console.error("no user");
                  }
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div id="header"></div>
        <div id="body" className="flex content-start p-20">
          {sortedMaps.map((map) => (
            <>
              <Card className="dark:bg-dark-600 max-w-xs" key={map.id}>
                <Flex gap="3" align="center">
                  <Box>
                    <Link href={"/map/" + map.id}>
                      <button>
                        <div className="p-3  rounded-lg m-10">{map.name}</div>
                        <div className="p-3  rounded-lg m-10">{map.description}</div>
                      </button>
                    </Link>
                  </Box>
                </Flex>
              </Card>
            </>
          ))}
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
