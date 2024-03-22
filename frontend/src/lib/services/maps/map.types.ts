import { RouterInput, RouterOutput, rqTrpc} from "../trpc/client";

export type MapCreateInput = RouterInput["maps"]["createMap"];
export type MapCreateOutput = RouterOutput["maps"]["createMap"];

export type MapDeleteInput = RouterInput["maps"]["deleteMapWithAllStacks"];
export type MapDeleteOuput = RouterOutput["maps"]["deleteMapWithAllStacks"];

export type MapUpdateInput = RouterInput["maps"]["updateMap"];
export type MapUpdateOuput = RouterOutput["maps"]["updateMap"];

export type MapGetMapsInput = RouterInput["maps"]["getUsersMaps"];
export type MapGetMapsOutput = RouterOutput["maps"]["getUsersMaps"];

export const mapRouter = rqTrpc.maps
