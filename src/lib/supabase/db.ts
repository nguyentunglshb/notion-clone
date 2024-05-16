import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "@/lib/supabase/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("Cannot find DB URL");
}

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });
const migrateDb = async () => {
  try {
    console.log("🟡 Migrating client");
    await migrate(db, {
      migrationsFolder: "migrations",
    });
    console.log("🟢 Successfully Migrated");
  } catch (e) {
    console.log("🔴 Error Migrating client");
  }
};

migrateDb();

export default db;
