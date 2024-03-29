import { Map, newMap } from "../../db/schema";
import { Logger, ScopedLogger } from "../../logger";
import { TRPCStatus, getTRPCError } from "../../utils";
import { MapModel, mapModelDrizzle } from "./map.model";

export interface MapController {
  createMap: (input: newMap) => Promise<TRPCStatus<Map>>;
  getMapsByUserId: (userId: string) => Promise<TRPCStatus<Map[]>>;
  updateMapById: (input: Map) => Promise<TRPCStatus<Map>>;
  deleteMapById: (mapId: string) => Promise<TRPCStatus<boolean>>;
}

class MapControllerDrizzle implements MapController {
  mapModel: MapModel;
  logger: Logger;
  constructor(mapModel: MapModel) {
    this.mapModel = mapModel;
    this.logger = new ScopedLogger("Map Controller");
  }
  async createMap(input: newMap) {
    const [err, map] = await this.mapModel.createMap(input);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, map] as const;
  }
  async getMapsByUserId(userId: string) {
    const [err, maps] = await this.mapModel.getMapsByUserId(userId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, maps] as const;
  }
  async updateMapById(input: Map) {
    const [err, map] = await this.mapModel.updateMapById(input);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, map] as const;
  }
  async deleteMapById(mapId: string) {
    const [err, success] = await this.mapModel.deleteMapById(mapId);

    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, success] as const;
  }
}

export const mapControllerDrizzle = new MapControllerDrizzle(mapModelDrizzle);
