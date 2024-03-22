// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import MapCard from "@/components/Flow/CardComponents/MapCard";
import { DialogTwoInputs } from "@/components/Flow/CustomComponents/DialogTwoInputs";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/services/authentication/userStore";
import useCreateMap from "@/lib/services/maps/useCreateMap";
import useDeleteMap from "@/lib/services/maps/useDeleteMap";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import useUpdateMap from "@/lib/services/maps/useUpdateMap";
import { Box } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "reactflow/dist/style.css";

function MapMenu() {
  const { isLoading, maps } = useGetMapByUserId();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const userId = useUserStore((state) => state.user?.id || null);
  const createMap = useCreateMap();
  const router = useRouter();
  const deleteMap = useDeleteMap();
  const updateMap = useUpdateMap();
  const [dialogName, setDialogName] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [mapIdEdit, setMapIdEdit] = useState("");

  if (isLoading) return null;

  const sortedMaps = maps.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleSubmitDialog = async (name: string, description: string) => {
    if (userId) {
      if (isCreate) {
        const [_err, map] = await createMap({
          name,
          description,
          userId: userId,
        });
        if (map) {
          router.push("/map/" + map.id);
        }
      } else {
        const map = maps.find((m) => m.id === mapIdEdit);
        if (map) {
          console.log(name, description);

          map.name = name;
          map.description = description;
          updateMap(map);
        } else {
          // TODO: better error catching
          console.error("no map");
        }
      }
    } else {
      // TODO: better error catching
      console.error("no user");
    }
  };

  const openDialog = (
    isCreate: boolean,
    name = "",
    description = "",
    mapId?: string,
  ) => {
    setDialogOpen(true);
    setIsCreate(isCreate);
    setDialogName(name);
    setDialogDescription(description);
    if (!isCreate && mapId) {
      setMapIdEdit(mapId);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogName("");
    setDialogDescription("");
    setMapIdEdit("");
  };

  return (
    <div className="relative w-full h-full">
      <div className="fixed">
        <FlowBackground />
      </div>
      <div className="z-10 absolute top-0 left-0 h-screen">
        {dialogOpen && (
          <DialogTwoInputs
            topInput={dialogName}
            bottomInput={dialogDescription}
            placeholderTopInput={"Name"}
            placeholderBottomInput={"Description"}
            isDialogOpen={dialogOpen}
            onSubmit={handleSubmitDialog}
            closeDialog={closeDialog}
            classNameInputFields={""}
          />
        )}
        <div
          id="header"
          className="flex flex-col justify-center items-center mt-16 text-2xl text-primary font-medium"
        >
          <h1 className="">Which map do you want to learn today?</h1>
        </div>
        <div id="body" className="flex content-start p-20 flex-wrap">
          {sortedMaps.map(
            (map: { id: string; name: string; description: string }) => (
              <>
                <div className="outline-none   mx-5 my-5" key={map.id}>
                  <Box>
                    <MapCard
                      map={map}
                      openEditMapDialog={openDialog}
                      deleteMap={deleteMap}
                    />
                  </Box>
                </div>
              </>
            ),
          )}
        </div>
        <FlowFooter>
          <>
            <Button onClick={() => openDialog(true)}>Add Map</Button>
          </>
        </FlowFooter>
      </div>
    </div>
  );
}

export default MapMenu;
