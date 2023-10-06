import { database } from "../user/user.model";

export type dbConnection = typeof database

export type ParentAndChildId = {
    child_id : string,
    new_parent_id : string
  }