import * as schema from "../../db/schema";
import * as stackModel from "./stackModels";
import * as types from "./types";

export async function controlCreateStack(
  stack: schema.NewStack,
  db: types.dbConnection
) {
  const date = new Date();

  const res = await stackModel.createStack(stack, date, db);
  return res;
}

export async function controlGetStackById(stackId:string, db:types.dbConnection){
  const res = await stackModel.getStackById(stackId, db)
  return res 
}

export async function controlGetAllStacksFromMap(
  mapId: string,
  db: types.dbConnection
) {
  const stacks = await stackModel.getStacksFromMap(mapId, db);
  console.log(stacks);
  
  const res = transformToHierarchy(stacks)
  return res;
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
}

export async function controlGetHighestOrderStacks(
  mapId: string,
  db: types.dbConnection
) {
  const res = await stackModel.getHighestOrderParentStacks(mapId, db);
  return res;
}

export async function controlGetDirectChildsFromParent(
  parentStackId: string,
  db: types.dbConnection
) {
  const res = await stackModel.getDirectChildsFromParent(parentStackId, db);
  return res;
}

export async function controlGetAllChildsFromParent(
  parentStackId: string,
  db: types.dbConnection
) {
  const res = await stackModel.getAllChildsFromParent(parentStackId, db);
  return res;
}

export async function controlGetParentFromStack(
  stackId: string,
  db: types.dbConnection
) {
  const res = await stackModel.getStackById(stackId, db);
  return res;
}

export async function controlChangeParentStack(
  parentAndChild: types.ParentAndChildId,
  db: types.dbConnection
) {
  const res = await stackModel.changeParentStack(parentAndChild, db);
  return res;
}

export async function controlDeleteParentStackRelation(
  childStackId: string,
  db: types.dbConnection
) {
  const res = await stackModel.deleteParentStackRelation(childStackId, db);
  return res;
}

export async function controlStackDeletionAndChildMoveUp(stackId:string, db:types.dbConnection){
  const res = await stackModel.deleteMiddleOrderStackAndMoveChildsUp(stackId, db)
  return res 
}

