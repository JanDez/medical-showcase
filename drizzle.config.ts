import { type Config } from "drizzle-kit";

export default {
  schema: "./src/app/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["medical-showcase_*"],
  out: "./drizzle/migrations",
  verbose: true,
  strict: true,
} satisfies Config;
