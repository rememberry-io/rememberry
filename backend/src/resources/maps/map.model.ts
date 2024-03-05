import dayjs from "dayjs";
import { eq, sql } from "drizzle-orm";
import { db, dbConnection } from "../../db/db";
import { Map, maps, newMap } from "../../db/schema";
import {
  TRPCStatus,
  getModelDefaultError,
  getTRPCError,
  hasOnlyOneEntry,
} from "../../utils";

export interface MapModel {
  createMap: (input: newMap) => Promise<TRPCStatus<Map>>;
  getMapsByUserId: (userId: string) => Promise<TRPCStatus<Map[]>>;
  updateMapById: (input: Map) => Promise<TRPCStatus<Map>>;
  deleteMapById: (mapId: string) => Promise<TRPCStatus<boolean>>;
}

class MapModelDrizzle implements MapModel {
  db: dbConnection;
  constructor(db: dbConnection) {
    this.db = db;
  }
  async createMap(input: newMap) {
    try {
      const map = await this.db.insert(maps).values(input).returning();

      if (!hasOnlyOneEntry(map)) return getTRPCError();

      return [null, map[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
  async getMapsByUserId(userId: string) {
    try {
      const prepared = this.db
        .select()
        .from(maps)
        .where(eq(maps.userId, sql.placeholder("id")))
        .prepare("maps");
      const userMaps = await prepared.execute({ id: userId });

      return [null, userMaps] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
  async updateMapById(input: Map) {
    try {
      const updatedMap = await this.db
        .update(maps)
        .set({
          name: input.name,
          description: input.description,
          peerId: input.peerId,
          updatedAt: dayjs().toDate(),
        })
        .where(eq(maps.id, input.id))
        .returning();

      if (!hasOnlyOneEntry(updatedMap)) return getTRPCError();

      return [null, updatedMap[0]] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
  async deleteMapById(mapId: string) {
    try {
      const deletedMap = await this.db
        .delete(maps)
        .where(eq(maps.id, mapId))
        .returning();

      if (!hasOnlyOneEntry(deletedMap)) return getTRPCError();

      return [null, true] as const;
    } catch (e) {
      return getModelDefaultError(e);
    }
  }
}

export const mapModelDrizzle = new MapModelDrizzle(db);

// Not sure what this does right now -> only seems to be relevant for peers which
// has will not be considered right now
export async function getUsersMaps(userId: string) {
  const res = await db.execute(sql`
  SELECT m.id, m.mapName, m.mapDescription
  FROM maps m
  WHERE m.userId = 'your_user_id'
  UNION 
  SELECT m.id, m.mapName, m.mapDescription
  FROM maps m
  JOIN peers p ON m.peerId = p.peerId
  JOIN users_peers up ON p.peerId = up.peerId
  WHERE up.userId = 'your_user_id';
`);
  return res.rows;
}

//also only relevant as soon as we support peers in the frontend
//until then does not have to be considered
export async function createSharedMap(map: newMap): Promise<newMap> {
  const res = await db
    .insert(maps)
    .values({
      userId: map.userId,
      peerId: map.peerId,
      name: map.name,
      description: map.description,
    })
    .returning();

  return res[0];
}
