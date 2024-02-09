// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import MapCard from "@/components/Flow/CardComponents/MapCard";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { FlowTextArea } from "@/components/Flow/CustomComponents/flowTextArea";
import useAutosizeTextArea from "@/components/Flow/hooks/useAutosizeTextArea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUserStore } from "@/lib/services/authentication/userStore";
import useCreateMap from "@/lib/services/maps/useCreateMap";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import { Box } from "@radix-ui/themes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import "reactflow/dist/style.css";

function MapMenu() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [description, setDescription] = useState("");
  const { isLoading, maps } = useGetMapByUserId();
  const [addMapActive, setAddMapActive] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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


  const handleZoomDialog = () => {
    setOpenDialog(true);
    setAddMapActive(false);
    setIsDialogOpen(true);
  };
  const openAddDialog = () => {
    setOpenDialog(true);
    setAddMapActive(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setAddMapActive(false);
  };

  const handleSubmit = () => {
    const handleDescriptionChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const valFront = evt.target?.value;
      setDescription(valFront);
      setAddMapActive(false);
    };
  };

  return (
    <div className="relative">
      <FlowBackground />
      <div className="z-10 absolute top-0 left-0 w-full h-screen">
        <Dialog open={openDialog || addMapActive} onOpenChange={closeDialog}>
          <DialogContent onAbort={closeDialog}>
            <div>
              <div>
                {addMapActive && (
                  <h1 className="text-2xl font-medium max-w-xl text-blackberry dark:text-white">
                    What do you want to call it?
                  </h1>
                )}
                <FlowTextArea
                  value={name}
                  textAreaRef={descriptionRef}
                  placeholder={"Map Name"}
                  className=""
                  rows={1}
                  changes={(value: string) => setName(value)}
                  readOnly={false}
                  isStack={false}
                  isInput={true}
                  onSubmit={handleSubmit}
                />
                <FlowTextArea
                  value={description}
                  textAreaRef={descriptionRef}
                  placeholder={"Description"}
                  className=""
                  rows={1}
                  changes={(value: string) => setDescription(value)}
                  readOnly={false}
                  isStack={false}
                  isInput={true}
                  onSubmit={handleSubmit}
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
        <div id="body" className="flex content-start p-20 w-screen flex-wrap">
          {sortedMaps.map((map) => (
            <>
              <div className="dark:bg-dark-600 mx-5 my-5" key={map.id}>
                <Box>
                  <MapCard
                    key={map.id}
                    map={{
                      id: map.id,
                      name: map.name,
                      description: map.description,
                    }}
                    handleToggleDialog={handleZoomDialog}
                  />
                </Box>
              </div>
            </>
          ))}
        </div>
        <FlowFooter>
          <>
            <Link href={"/map"}>
              <Button className="flex items-center ">
                <span>Go to Map</span>
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button onClick={openAddDialog}>Add Map</Button>
          </>
        </FlowFooter>
      </div>
    </div>
  );
}

export default MapMenu;
