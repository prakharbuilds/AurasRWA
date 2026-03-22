import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { assetsTable } from "./assets";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assetsTable.id),
  type: text("type").notNull(),
  tokens: integer("tokens").notNull(),
  pricePerToken: numeric("price_per_token", { precision: 20, scale: 6 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 20, scale: 2 }).notNull(),
  status: text("status").notNull().default("completed"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
