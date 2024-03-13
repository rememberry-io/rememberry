// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import MapCard from "@/components/Flow/CardComponents/MapCard";
import FlowFooter from "@/components/Flow/CustomComponents/flowFooter";
import { MapDialog } from "@/components/Flow/CustomComponents/mapDialog";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/services/authentication/userStore";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import { Box } from "@radix-ui/themes";
import { useState } from "react";
import "reactflow/dist/style.css";

function MapMenu() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mapId, setMapId] = useState("");
  const { isLoading, maps } = useGetMapByUserId();
  const [addMapActive, setAddMapActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingActive, setEditingActive] = useState(false);
  const [isZoomActive, setZoomActive] = useState(false);

  const userId = useUserStore((state) => state.user?.id || null);

  if (isLoading) return null;

  const sortedMaps = maps.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const handleToggleDialog = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const handleZoomDialog = (map: {
    id: string;
    name: string;
    description: string;
  }) => {
    setName(map.name);
    setDescription(map.description);
    setMapId(map.id);
    setIsDialogOpen(true);
    setZoomActive(true);
    setEditingActive(false);
    setAddMapActive(false);
    console.log("zoom:", map.name, map.description);
  };

  const toggleEditMode = () => {
    if (isZoomActive) {
      setEditingActive(true);
      setZoomActive(false);
    }
  };
  const handleEditDialog = (map: {
    id: string;
    name: string;
    description: string;
  }) => {
    setName(map.name);
    setDescription(map.description);
    setMapId(map.id);
    setIsDialogOpen(true);
    setEditingActive(true);
    setAddMapActive(false);
    console.log("edit:", map.name, map.description);
    console.log("edit:", map.name, map.description);
  };

  const openAddDialog = () => {
    setIsDialogOpen(true);
    setAddMapActive(true);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setAddMapActive(false);
    setEditingActive(false);
    setName("");
    setDescription("");
  };

  const handleSubmit = () => {
    const handleDescriptionChange = (
      evt: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      const val = evt.target?.value;
      setDescription(val);
      setAddMapActive(false);
    };
  };

  const handleMapId = (id: string) => {
    setMapId(id);
  };
  const handleMapName = (name: string) => {
    setName(name);
  };

  return (
    <div className="relative w-full h-full">
      <div className="fixed">
        <FlowBackground />
      </div>
      <div className="z-10 absolute top-0 left-0 h-screen">
        <MapDialog
          userID={userId ?? ""}
          mapID={mapId}
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
          mapName={name}
          mapDescription={description}
          onSubmit={handleSubmit}
          isAddingactive={addMapActive}
          isEditingActive={isEditingActive}
          isZoomActive={isZoomActive}
          toggleEditMode={toggleEditMode}
        />
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
                      key={map.id}
                      map={{
                        id: map.id as string,
                        name: map.name,
                        description: map.description,
                      }}
                      handleToggleDialog={handleToggleDialog}
                      handleZoomDialog={() => handleZoomDialog(map)}
                      handleMapId={handleMapId}
                      handleMapName={handleMapName}
                      handleEditDialog={() => handleEditDialog(map)}
                    />
                  </Box>
                </div>
              </>
            ),
          )}
        </div>
        <FlowFooter>
          <>
            <Button onClick={openAddDialog}>Add Map</Button>
          </>
        </FlowFooter>
      </div>
    </div>
  );
}

export default MapMenu;
