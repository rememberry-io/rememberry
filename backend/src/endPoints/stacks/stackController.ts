import * as schema from "../../db/schema";
import * as cacheModel from "../cache/cacheModel";

import * as stackModel from "./stackModels";
import * as types from "./types";

export async function controlCreateStack(stack: schema.NewStack) {
  const date = new Date();
  const [errorCheck, res] = await stackModel.createStack(stack, date);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlGetStackById(stackId: string) {
  const [errorCheck, res] = await stackModel.getStackById(stackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlGetAllStacksFromMap(mapId: string) {
  const cacheResult = await cacheModel.readCache(mapId);
  if (cacheResult) {
    return [null, cacheResult] as const;
  }
  let [errorCheck, stacks] = await stackModel.getStacksFromMap(mapId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  if (isObject(stacks)) {
    stacks = transformToHierarchy(stacks);
    cacheModel.cacheValue(mapId, stacks);
  }
  return [null, stacks] as const;
}

export async function controlGetAllChildsFromParent(parentStackId: string) {
  const cacheResult = await cacheModel.readCache(parentStackId);
  if (cacheResult) {
    return [null, cacheResult] as const;
  }
  const [errorCheck, res] =
    await stackModel.getAllChildsFromParent(parentStackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  if (isObject(res)) {
    cacheModel.cacheValue(parentStackId, res);
  }
  return [null, res] as const;
}

const transformToHierarchy = (data: types.Stack[]): types.Stack[] => {
  const lookup: { [key: string]: types.Stack } = {};

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    lookup[item.stack_id] = item;
    item.children = [];
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const parent_id = item.parent_stack_id;
    if (parent_id && lookup[parent_id]) {
      lookup[parent_id].children!.push(item);
    }
  }

  const result: types.Stack[] = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item.parent_stack_id) {
      result.push(item);
    }
  }

  return result;
};

export async function controlGetHighestOrderStacks(mapId: string) {
  const [errorCheck, res] = await stackModel.getHighestOrderParentStacks(mapId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlGetDirectChildsFromParent(parentStackId: string) {
  const [errorCheck, res] =
    await stackModel.getDirectChildsFromParent(parentStackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

function isObject(value: any): value is object {
  return typeof value === "object" && value !== null;
}

export async function controlGetParentFromStack(stackId: string) {
  const [errorCheck, res] = await stackModel.getStackById(stackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlChangeParentStack(
  parentAndChild: types.ParentAndChildId,
) {
  const [errorCheck, res] = await stackModel.changeParentStack(parentAndChild);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlDeleteParentStackRelation(childStackId: string) {
  const [errorCheck, res] =
    await stackModel.deleteParentStackRelation(childStackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlStackDeletionAndChildMoveUp(stackId: string) {
  const [errorCheck, res] =
    await stackModel.deleteMiddleOrderStackAndMoveChildsUp(stackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}

export async function controlStackAndChildDeletion(stackId: string) {
  const [errorCheck, res] = await stackModel.deleteStackAndChildren(stackId);
  if (errorCheck) {
    return [errorCheck, null] as const;
  }
  return [null, res] as const;
}
