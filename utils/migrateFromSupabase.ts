// Pet Name
const pet = process.env.PET_NAME;

// MongoDB
import { Db, MongoClient } from "mongodb";
import { dbHandler } from "../lib/dbHander.js";
const connectionString = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB;

const client = new MongoClient(connectionString);
const conn: MongoClient = await client.connect();
const db: Db = conn.db(databaseName);

const dbh = new dbHandler(db, pet);


// Supabase
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getSupabaseEntries() {
    const { data, error } = await supabase.from(pet).select("md5");
    if (error) {
        console.error(error);
        return [];
    }
    return data;
}

async function migrateEntry(entry: any) {
    const { data, error } = await supabase.from(pet).select("*").eq("md5", entry.md5);
    if (error) {
        console.error(error);
        return;
    }
    console.log(`Migrating entry ${entry.md5}...`);
    const { md5, alias, image } = data[0];

    const imageBuffer = Buffer.from(image, "base64");

    await dbh.uploadBufferToDB(md5, alias, imageBuffer);
}

console.log("Fetching entries from Supabase...");
const entries = await getSupabaseEntries();
console.log(`Fetched ${entries.length} entries from Supabase`);
console.log("Migrating entries to MongoDB...");
for (const entry of entries) {
    await migrateEntry(entry);
}
console.log("Done!");
await client.close();
