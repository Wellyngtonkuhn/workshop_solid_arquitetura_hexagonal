import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user-table.js";

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade"
  }),

  refresh_token_hash: varchar("refresh_token_hash").notNull(),

  expires_at: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  revoked_at: timestamp("revoked_at", {
    withTimezone: true,
  }),

  created_at: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow().notNull(),

  updated_at: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow().notNull(),
});
