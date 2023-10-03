import { client } from "../../db/db";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";

const db = drizzle(client, { schema });
