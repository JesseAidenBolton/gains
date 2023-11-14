import {neon, neonConfig} from '@neondatabase/serverless'
import {drizzle} from "drizzle-orm/neon-http";
require('dotenv').config();

neonConfig.fetchConnectionCache = true

console.log(process.env.DATABASE_URL)


//const database = process.env.DATABASE_URL

/*if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}*/

const sql = neon();

export const db = drizzle(sql);