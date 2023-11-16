import * as schema from "../../db/schema";
import * as mapModels from "./mapModels";

export async function controlMapCreation(userInput: schema.newMap) {
  const res = await mapModels.createMap(userInput);
  return res;
}

export async function controlUpdateMap(userInput: schema.newMap) {
  const res = await mapModels.updateMap(userInput);
  return res;
}

export async function controlDeleteMapWithAllStacks(mapId: string) {
  const res = await mapModels.deleteMapWithAllStacks(mapId);
  return res;
}

export async function controlGetUsersMaps(userId: string) {
  const res = mapModels.getUsersMaps(userId)
  return res;
}
