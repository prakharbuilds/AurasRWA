import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { assetsTable } from "./assets";

export const holdingsTable = pgTable("holdings", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assetsTable.id),
  tokensOwned: integer("tokens_owned").notNull(),
  purchaseValue: numeric("purchase_value", { precision: 20, scale: 2 }).notNull(),
  pendingYield: numeric("pending_yield", { precision: 20, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertHoldingSchema = createInsertSchema(holdingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdingsTable.$inferSelect;
