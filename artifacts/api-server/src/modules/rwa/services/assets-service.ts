import { db, assetsTable, assetDocumentsTable, assetHighlightsTable, tokenDistributionTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { mapAssetNumbers } from "../utils/asset-mappers";

export async function listAssets(filters: {
  category?: string;
  status?: string;
  page: number;
  limit: number;
}) {
  const { category, status, page, limit } = filters;
  const offset = (page - 1) * limit;

  let query = db.select().from(assetsTable).$dynamic();

  if (category) query = query.where(eq(assetsTable.category, category));
  if (status) query = query.where(eq(assetsTable.status, status));

  const assets = await query.limit(limit).offset(offset);
  const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(assetsTable);

  return {
    assets: assets.map(mapAssetNumbers),
    total: Number(countResult?.count ?? 0),
    page,
    limit,
  };
}

export async function createAsset(data: {
  name: string;
  symbol: string;
  category: string;
  description: string;
  totalValue: number;
  tokenPrice: number;
  totalTokens: number;
  annualYield: number;
  location: string;
  riskLevel: "low" | "medium" | "high";
  minimumInvestment: number;
}) {
  const [asset] = await db
    .insert(assetsTable)
    .values({
      ...data,
      totalValue: String(data.totalValue),
      tokenPrice: String(data.tokenPrice),
      availableTokens: data.totalTokens,
      annualYield: String(data.annualYield),
      minimumInvestment: String(data.minimumInvestment),
      status: "pending",
    })
    .returning();

  return mapAssetNumbers(asset);
}

export async function getAssetById(assetId: number) {
  const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.id, assetId));

  if (!asset) {
    return null;
  }

  const [documents, highlights, distribution] = await Promise.all([
    db.select().from(assetDocumentsTable).where(eq(assetDocumentsTable.assetId, asset.id)),
    db
      .select()
      .from(assetHighlightsTable)
      .where(eq(assetHighlightsTable.assetId, asset.id))
      .orderBy(assetHighlightsTable.sortOrder),
    db.select().from(tokenDistributionTable).where(eq(tokenDistributionTable.assetId, asset.id)),
  ]);

  return {
    ...mapAssetNumbers(asset),
    riskLevel: asset.riskLevel ?? "medium",
    documents: documents.map((document: any) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      url: document.url,
    })),
    highlights: highlights.map((highlight: any) => highlight.text),
    tokenDistribution: distribution.map((entry: any) => ({
      label: entry.label,
      percentage: Number(entry.percentage),
      color: entry.color,
    })),
  };
}
