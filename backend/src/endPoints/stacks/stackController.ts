import * as schema from '../../db/schema'
import * as stackModel from './stackModels'
import * as types from './types'

export async function controlCreateStack(stack:schema.NewStack, db: types.dbConnection){
    const date = new Date()
    const res = await stackModel.createStack(stack, date, db)
    return res
}

export async function controlGetAllStacksFromMap(mapId:string, db:types.dbConnection){
    const res = await stackModel.getStacksFromMap(mapId, db)
    return res 
}

export async function controlGetHighestOrderStacks(mapId:string, db:types.dbConnection){
    const res = await stackModel.getHighestOrderParentStacks(mapId, db)
    return res 
}

export async function controlGetDirectChildsFromParent(parentStackId:string, db:types.dbConnection){
    const res = await stackModel.getDirectChildsFromParent(parentStackId, db)
    return res 
}

export async function controlGetAllChildsFromParent(parentStackId:string, db:types.dbConnection){
    const res = await stackModel.getAllChildsFromParent(parentStackId, db)
    return res 
}

export async function controlGetParentFromStack(stackId:string, db:types.dbConnection){
    const res = await stackModel.getStackById(stackId, db)
    return res
}

export async function controlChangeParentStack(parentAndChild:types.ParentAndChildId, db:types.dbConnection){
    const res = await stackModel.changeParentStack(parentAndChild, db)
    return res 
}

export async function controlDeleteParentStackRelation(childStackId:string, db:types.dbConnection){
    const res = await stackModel.deleteParentStackRelation(childStackId, db)
    return res
}