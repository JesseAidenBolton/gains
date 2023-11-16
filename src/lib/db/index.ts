import {neon, neonConfig} from '@neondatabase/serverless'
import {drizzle} from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true

let databaseUrl = process.env.DATABASE_URL

if(!databaseUrl) {
    console.warn('DATABASE)URL is not defined. Using default database URL')
    //throw new Error('DATABASE_URL is not defined.');
}

const sql = neon(databaseUrl!);

export const db = drizzle(sql);