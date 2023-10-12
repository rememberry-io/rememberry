import * as schema from '../../db/schema'
import { client } from '../../db/db'
import { drizzle} from 'drizzle-orm/node-postgres'
import * as types from'./types'
import { eq, and} from 'drizzle-orm'

const database = drizzle(client, {schema})

export async function checkLoginCredentials(credentials:types.LoginCredentials){
    const user = await database.select({
        user_id: schema.users.user_id,
        password: schema.users.password
    })
    .from(schema.users)
    .where(eq(schema.users.email, credentials.email))
    return user[0]
}

export async function updateRefreshToken(token:string){
    const refreshToken = await database
    .update(schema.users)
    .set({
        refresh_token: token
    })
    .returning()
    return refreshToken
}
