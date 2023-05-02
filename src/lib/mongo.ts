import { Db, MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

const client = new MongoClient(connectionString);

const conn: MongoClient = await client.connect();
export const db: Db = conn.db(databaseName);
