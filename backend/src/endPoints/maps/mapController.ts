import * as schema from "../../db/schema";
import * as mapModels from "./mapModels";

export async function controlMapCreation(userInput: schema.newMap) {
  const [errorCheck, res] = await mapModels.createMap(userInput);
  if(errorCheck){
    return [errorCheck, null] as const
  }
  return [null, res] as const;
}

export async function controlUpdateMap(userInput: schema.newMap) {
  const [errorCheck, res] = await mapModels.updateMap(userInput);
  if(errorCheck){
    return [errorCheck, null] as const
  }
  return [null, res] as const;
}

export async function controlDeleteMapWithAllStacks(mapId: string) {
  const [errorCheck, res]= await mapModels.deleteMapWithAllStacks(mapId);
  if(errorCheck){
    return [errorCheck, null] as const 
  }
  return [null, res] as const;
}

export async function controlGetUsersMaps(userId: string) {
  const res = mapModels.getUsersMaps(userId)
  return res;
}
