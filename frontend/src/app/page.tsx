// root page
"use client";
import FlowBackground from "@/components/Flow/Background/flowBackground";
import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUserStore } from "@/lib/services/authentication/userStore";
import useCreateMap from "@/lib/services/maps/useCreateMap";
import useGetMapByUserId from "@/lib/services/maps/useGetMapsByUserId";
import { Box, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function MapMenu() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { isLoading, maps } = useGetMapByUserId();
  const createMap = useCreateMap();
  const [openDialog, setOpenDialog] = useState(false);
  const userId = useUserStore((state) => {
    if (state.user) {
      return state.user.id;
    }
    return null;
  });

  if (isLoading) return null;

  const sortedMaps = maps.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const openNamingDialog = () => {
    setOpenDialog(true);
  };

  return (
    <div className="relative">
      <FlowBackground />
      <div className="z-10 absolute top-0 left-0 w-full h-screen">
        <Dialog open={openDialog}>
          <DialogContent onAbort={() => setOpenDialog(false)}>
            <div>
              <div>
                <h1 className="text-2xl font-medium max-w-xl text-blackberry">
                  What do you want to call it?
                </h1>
                <input
                  className=" rounded-md h-fit mt-4 my-2 bg-ashberry outline-none resize-none w-full break-words"
                  placeholder="Map Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                        description: "",
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
              <Card style={{ maxWidth: 240 }} key={map.id}>
                <Flex gap="3" align="center">
                  <Box>
                    <Link href={"/map/" + map.id}>
                      <button>
                        <div className="p-3 rounded-lg m-10">{map.name}</div>
                      </button>
                    </Link>
                  </Box>
                </Flex>
              </Card>
            </>
          ))}
        </div>
        <div
          id="footer"
          className="flex flex-row items-center justify-center space-x-4 fixed bottom-0 right-0 w-full h-16 bg-white"
        >
          <Button onClick={openNamingDialog}>Add Map</Button>
        </div>
      </div>
    </div>
  );
}

export default MapMenu;
