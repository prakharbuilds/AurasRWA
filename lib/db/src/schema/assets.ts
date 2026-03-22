import { pgTable, text, serial, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assetsTable = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  totalValue: numeric("total_value", { precision: 20, scale: 2 }).notNull(),
  tokenPrice: numeric("token_price", { precision: 20, scale: 6 }).notNull(),
  totalTokens: integer("total_tokens").notNull(),
  availableTokens: integer("available_tokens").notNull(),
  annualYield: numeric("annual_yield", { precision: 8, scale: 4 }).notNull(),
  status: text("status").notNull().default("pending"),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  priceChange24h: numeric("price_change_24h", { precision: 8, scale: 4 }).default("0"),
  riskLevel: text("risk_level").notNull().default("medium"),
  minimumInvestment: numeric("minimum_investment", { precision: 20, scale: 2 }).notNull(),
  maturityDate: timestamp("maturity_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAssetSchema = createInsertSchema(assetsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assetsTable.$inferSelect;

export const assetDocumentsTable = pgTable("asset_documents", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assetsTable.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assetHighlightsTable = pgTable("asset_highlights", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assetsTable.id),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tokenDistributionTable = pgTable("token_distribution", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assetsTable.id),
  label: text("label").notNull(),
  percentage: numeric("percentage", { precision: 8, scale: 4 }).notNull(),
  color: text("color").notNull(),
});

export const priceHistoryTable = pgTable("price_history", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assetsTable.id),
  date: text("date").notNull(),
  value: numeric("value", { precision: 20, scale: 6 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
