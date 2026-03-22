import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, assetsTable, assetDocumentsTable, assetHighlightsTable, tokenDistributionTable } from "@workspace/db";
import {
  ListAssetsQueryParams,
  ListAssetsResponse,
  CreateAssetBody,
  GetAssetParams,
  GetAssetResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/assets", async (req, res): Promise<void> => {
  const query = ListAssetsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "invalid_query", message: query.error.message });
    return;
  }

  const { category, status, page = 1, limit = 20 } = query.data;
  const offset = (page - 1) * limit;

  let baseQuery = db.select().from(assetsTable).$dynamic();
  if (category) {
    baseQuery = baseQuery.where(eq(assetsTable.category, category));
  }
  if (status) {
    baseQuery = baseQuery.where(eq(assetsTable.status, status));
  }

  const assets = await baseQuery.limit(limit).offset(offset);
  const [countResult] = await db.select({ count: sql<number>`count(*)` }).from(assetsTable);
  const total = Number(countResult?.count ?? 0);

  const mapped = assets.map((a) => ({
    ...a,
    totalValue: Number(a.totalValue),
    tokenPrice: Number(a.tokenPrice),
    annualYield: Number(a.annualYield),
    priceChange24h: Number(a.priceChange24h ?? 0),
    minimumInvestment: Number(a.minimumInvestment),
    imageUrl: a.imageUrl ?? null,
  }));

  res.json(
    ListAssetsResponse.parse({
      assets: mapped,
      total,
      page,
      limit,
    })
  );
});

router.post("/assets", async (req, res): Promise<void> => {
  const parsed = CreateAssetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", message: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [asset] = await db
    .insert(assetsTable)
    .values({
      name: data.name,
      symbol: data.symbol,
      category: data.category,
      description: data.description,
      totalValue: String(data.totalValue),
      tokenPrice: String(data.tokenPrice),
      totalTokens: data.totalTokens,
      availableTokens: data.totalTokens,
      annualYield: String(data.annualYield),
      location: data.location,
      riskLevel: data.riskLevel,
      minimumInvestment: String(data.minimumInvestment),
      status: "pending",
    })
    .returning();

  res.status(201).json({
    ...asset,
    totalValue: Number(asset.totalValue),
    tokenPrice: Number(asset.tokenPrice),
    annualYield: Number(asset.annualYield),
    priceChange24h: Number(asset.priceChange24h ?? 0),
    minimumInvestment: Number(asset.minimumInvestment),
  });
});

router.get("/assets/:id", async (req, res): Promise<void> => {
  const params = GetAssetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "invalid_params", message: params.error.message });
    return;
  }

  const [asset] = await db
    .select()
    .from(assetsTable)
    .where(eq(assetsTable.id, params.data.id));

  if (!asset) {
    res.status(404).json({ error: "not_found", message: "Asset not found" });
    return;
  }

  const documents = await db
    .select()
    .from(assetDocumentsTable)
    .where(eq(assetDocumentsTable.assetId, asset.id));

  const highlights = await db
    .select()
    .from(assetHighlightsTable)
    .where(eq(assetHighlightsTable.assetId, asset.id))
    .orderBy(assetHighlightsTable.sortOrder);

  const distribution = await db
    .select()
    .from(tokenDistributionTable)
    .where(eq(tokenDistributionTable.assetId, asset.id));

  res.json(
    GetAssetResponse.parse({
      ...asset,
      totalValue: Number(asset.totalValue),
      tokenPrice: Number(asset.tokenPrice),
      annualYield: Number(asset.annualYield),
      priceChange24h: Number(asset.priceChange24h ?? 0),
      minimumInvestment: Number(asset.minimumInvestment),
      imageUrl: asset.imageUrl ?? null,
      riskLevel: asset.riskLevel ?? "medium",
      documents: documents.map((d) => ({ id: d.id, name: d.name, type: d.type, url: d.url })),
      highlights: highlights.map((h) => h.text),
      tokenDistribution: distribution.map((d) => ({
        label: d.label,
        percentage: Number(d.percentage),
        color: d.color,
      })),
    })
  );
});

export default router;
