import * as schema from "../../db/schema";
import * as types from "./types";
import * as mapModels from "./mapModels";
import { mapColumnsInAliasedSQLToAlias } from "drizzle-orm";

export async function controlMapCreation(
  userInput: schema.newMap,
  db: types.dbConnection
) {
  const res = await mapModels.createMap(userInput, db);
  return res;
}

export async function controlUpdateMap(
  userInput: schema.newMap,
  db: types.dbConnection
) {
  const res = await mapModels.updateMap(userInput, db);
  return res;
}

export async function controlDeleteMapWithAllStacks(
  mapId: string,
  db: types.dbConnection
) {
  const res = await mapModels.deleteMapWithAllStacks(mapId, db);
  return res;
}

export async function controlGetUsersMaps(
  userId: string,
  db: types.dbConnection
) {
  const res = mapModels.getMapsByUserId(userId, db);
  return res;
}
