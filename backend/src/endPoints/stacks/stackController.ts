//import * as cacheModel from "../cache/cacheModel";

import { NewStack, Stack } from "../../db/schema";
import { getTRPCError } from "../../utils";
import { TRPCStatus } from "../auth/types";
import { StackModel, stackModelDrizzle } from "./stackModels";
import { StackWithChildren } from "./types";

interface StackController {
  createStack: (stack: NewStack) => Promise<TRPCStatus<Stack>>;
  getStackById: (stackId: string) => Promise<TRPCStatus<Stack>>;
  getStacksByMapId: (mapId: string) => Promise<TRPCStatus<StackWithChildren[]>>;
  getTopLevelStacksByMapId: (mapId: string) => Promise<TRPCStatus<Stack[]>>;
  getDirectChildrenStacksFromParentStack: (
    stackId: string,
  ) => Promise<TRPCStatus<Stack[]>>;
  getAllChildrenStacksFromParentStack: (
    stackId: string,
  ) => Promise<TRPCStatus<Stack[]>>;
  updateStackById: (stack: Stack) => Promise<TRPCStatus<Stack>>;
  changeParentStack: (
    parentId: string,
    stackId: string,
  ) => Promise<TRPCStatus<Stack>>;
  deleteParentStackRelation: (stackId: string) => Promise<TRPCStatus<Stack>>;
  deleteMiddleOrderStackAndMoveChildrenUp: (
    stackId: string,
  ) => Promise<TRPCStatus<Stack[]>>;
  deleteStackAndChildren: (stackId: string) => Promise<TRPCStatus<Stack[]>>;
}

class StackControllerDrizzle implements StackController {
  stackModel: StackModel;
  constructor(stackModel: StackModel) {
    this.stackModel = stackModel;
  }

  async createStack(newStack: NewStack) {
    const [err, stack] = await this.stackModel.createStack(newStack);
    if (err) return getTRPCError(err.message, err.code);
    return [null, stack] as const;
  }

  async getStackById(stackId: string) {
    const [err, stack] = await this.stackModel.getStackById(stackId);
    if (err) return [err, null] as const;

    return [null, stack] as const;
  }

  async getStacksByMapId(mapId: string) {
    //const cacheResult = await cacheModel.readCache(mapId);
    //if (cacheResult) {
    //  return [null, cacheResult] as const;
    //}
    const [err, stacks] = await this.stackModel.getStacksByMapId(mapId);

    if (err) return getTRPCError(err.message, err.code);

    const stackWithChildren = this.transformToHierarchy(stacks);
    //  cacheModel.cacheValue(mapId, stacks);

    return [null, stackWithChildren] as const;
  }

  private transformToHierarchy(data: StackWithChildren[]): StackWithChildren[] {
    const lookup: { [key: string]: StackWithChildren } = {};

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      lookup[item.id] = item;
      item.children = [];
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const parent_id = item.parentStackId;
      if (parent_id && lookup[parent_id]) {
        lookup[parent_id].children!.push(item);
      }
    }

    const result: StackWithChildren[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!item.parentStackId) {
        result.push(item);
      }
    }

    return result;
  }

  async getAllChildrenStacksFromParentStack(stackId: string) {
    //const cacheResult = await cacheModel.readCache(parentStackId);
    // if (cacheResult) {
    //   return [null, cacheResult] as const;
    // }

    const [err, stacks] =
      await this.stackModel.getAllChildrenStacksFromParentStack(stackId);

    if (err) return getTRPCError(err.message, err.code);

    //cacheModel.cacheValue(parentStackId, res);

    return [null, stacks] as const;
  }

  async getTopLevelStacksByMapId(mapId: string) {
    const [err, stacks] = await this.stackModel.getTopLevelStacksByMapId(mapId);

    if (err) return getTRPCError(err.message, err.code);

    return [null, stacks] as const;
  }
  async getDirectChildrenStacksFromParentStack(parentStackId: string) {
    const [err, stacks] =
      await this.stackModel.getDirectChildrenStacksFromParentStack(
        parentStackId,
      );

    if (err) return getTRPCError(err.message, err.code);

    return [null, stacks] as const;
  }

  async updateStackById(stack: Stack) {
    const [err, updatedStack] = await this.stackModel.updateStackById(stack);

    if (err) return getTRPCError(err.message, err.code);

    return [null, updatedStack] as const;
  }

  async changeParentStack(parentId: string, childId: string) {
    const [err, stack] = await this.stackModel.changeParentStack(
      parentId,
      childId,
    );

    if (err) return getTRPCError(err.message, err.code);

    return [null, stack] as const;
  }

  async deleteParentStackRelation(stackId: string) {
    const [err, stack] =
      await this.stackModel.deleteParentStackRelation(stackId);

    if (err) return getTRPCError(err.message, err.code);

    return [null, stack] as const;
  }

  async deleteMiddleOrderStackAndMoveChildrenUp(stackId: string) {
    const [err, stacks] =
      await this.stackModel.deleteMiddleOrderStackAndMoveChildrenUp(stackId);

    if (err) return getTRPCError(err.message, err.code);

    return [null, stacks] as const;
  }

  async deleteStackAndChildren(stackId: string) {
    const [err, stacks] = await this.stackModel.deleteStackAndChildren(stackId);

    if (err) return getTRPCError(err.message, err.code);

    return [null, stacks] as const;
  }
}

export const stackControllerDrizzle = new StackControllerDrizzle(
  stackModelDrizzle,
);
