import { Notification } from "pg";
import * as cacheModels from "./cacheModel";

export function controlTriggerMessage(message: Notification) {
  const key = message.payload!.split(",")[2];
  cacheModels.invalidateValue(key);
}
