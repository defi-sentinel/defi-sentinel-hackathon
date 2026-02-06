import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

// Initialize SQLite database
const sqlite = new Database(path.join(process.cwd(), "sqlite.db"));

// Create Drizzle database instance
export const db = drizzle(sqlite, { schema });

// Export schema for easy access
export * from "./schema";

