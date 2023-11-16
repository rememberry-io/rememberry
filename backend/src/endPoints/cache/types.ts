export type TriggerMessage = {
    processId:number,
    channel:string,
    payload:string | undefined,
    name?:string
  }