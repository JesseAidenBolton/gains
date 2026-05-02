import {neon} from '@neondatabase/serverless'
import {drizzle} from "drizzle-orm/neon-http";

let databaseUrl = process.env.DATABASE_URL

if(!databaseUrl) {
    console.warn('DATABASE_URL is not defined. Using local placeholder database URL')
    databaseUrl = 'postgresql://user:password@localhost:5432/gains'
}

const sql = neon(databaseUrl);

export const db = drizzle(sql);
