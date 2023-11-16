import {neon, neonConfig} from '@neondatabase/serverless'
import {drizzle} from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true



//const database = process.env.DATABASE_URL

if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);