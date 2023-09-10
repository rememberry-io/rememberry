import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone'
import { Pool } from 'pg'

const pool = new Pool({
    user: 'postgres',
    password: 'cooking',
    host: 'localhost',
    database: 'trpcTodoList',
    port: 5432,
})


export const createContext = (opts: CreateHTTPContextOptions) => {
    return {
        db:pool
    }
}

export type Context = ReturnType<typeof createContext>
