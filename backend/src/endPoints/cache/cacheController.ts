import * as types from './types'
import * as cacheModels from './cacheModel'
import { Notification } from 'pg';

export function controlTriggerMessage(message:Notification){
    const key = message.payload!.split(',')[2]
    cacheModels.invalidateValue(key)
}
