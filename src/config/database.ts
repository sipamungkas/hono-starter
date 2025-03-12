import { drizzle } from "drizzle-orm/postgres-js";
import * as postgres from "postgres";
import * as schema from "../models";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://user:password@localhost:5432/auth_db";
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
