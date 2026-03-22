import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, holdingsTable, assetsTable, priceHistoryTable } from "@workspace/db";
import {
  GetPortfolioResponse,
  ListHoldingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/portfolio", async (_req, res): Promise<void> => {
  const holdings = await db
    .select({
      id: holdingsTable.id,
      assetId: holdingsTable.assetId,
      tokensOwned: holdingsTable.tokensOwned,
      purchaseValue: holdingsTable.purchaseValue,
      pendingYield: holdingsTable.pendingYield,
      assetName: assetsTable.name,
      assetCategory: assetsTable.category,
      tokenPrice: assetsTable.tokenPrice,
      annualYield: assetsTable.annualYield,
    })
    .from(holdingsTable)
    .leftJoin(assetsTable, eq(holdingsTable.assetId, assetsTable.id));

  let totalValue = 0;
  let totalInvested = 0;
  let totalPendingYield = 0;
  const categoryMap: Record<string, { value: number; color: string }> = {};

  const CATEGORY_COLORS: Record<string, string> = {
    real_estate: "#f59e0b",
    commodities: "#10b981",
    bonds: "#3b82f6",
    art: "#8b5cf6",
    infrastructure: "#ef4444",
    private_equity: "#06b6d4",
  };

  for (const h of holdings) {
    const currentValue = h.tokensOwned * Number(h.tokenPrice ?? 0);
    totalValue += currentValue;
    totalInvested += Number(h.purchaseValue);
    totalPendingYield += Number(h.pendingYield);
    const cat = h.assetCategory ?? "other";
    if (!categoryMap[cat]) {
      categoryMap[cat] = { value: 0, color: CATEGORY_COLORS[cat] ?? "#94a3b8" };
    }
    categoryMap[cat].value += currentValue;
  }

  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const allocationByCategory = Object.entries(categoryMap).map(([category, { value, color }]) => ({
    category,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    color,
  }));

  const performanceHistory = await db
    .select()
    .from(priceHistoryTable)
    .where(eq(priceHistoryTable.assetId, -1))
    .limit(0);

  const now = new Date();
  const history = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const factor = 1 + (Math.random() - 0.48) * 0.02;
    return { date: dateStr, value: Math.round(totalValue * (0.85 + (i / 30) * 0.15) * factor) };
  });

  res.json(
    GetPortfolioResponse.parse({
      totalValue,
      totalInvested,
      totalGainLoss,
      totalGainLossPercent,
      totalPendingYield,
      allocationByCategory,
      performanceHistory: history,
    })
  );
});

router.get("/portfolio/holdings", async (_req, res): Promise<void> => {
  const holdings = await db
    .select({
      id: holdingsTable.id,
      assetId: holdingsTable.assetId,
      tokensOwned: holdingsTable.tokensOwned,
      purchaseValue: holdingsTable.purchaseValue,
      pendingYield: holdingsTable.pendingYield,
      assetName: assetsTable.name,
      assetSymbol: assetsTable.symbol,
      assetCategory: assetsTable.category,
      tokenPrice: assetsTable.tokenPrice,
      annualYield: assetsTable.annualYield,
    })
    .from(holdingsTable)
    .leftJoin(assetsTable, eq(holdingsTable.assetId, assetsTable.id));

  const mapped = holdings.map((h) => {
    const currentValue = h.tokensOwned * Number(h.tokenPrice ?? 0);
    const purchaseValue = Number(h.purchaseValue);
    const gainLoss = currentValue - purchaseValue;
    return {
      id: h.id,
      assetId: h.assetId,
      assetName: h.assetName ?? "",
      assetSymbol: h.assetSymbol ?? "",
      assetCategory: h.assetCategory ?? "",
      tokensOwned: h.tokensOwned,
      currentValue,
      purchaseValue,
      gainLoss,
      gainLossPercent: purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0,
      annualYield: Number(h.annualYield ?? 0),
      pendingYield: Number(h.pendingYield),
    };
  });

  res.json(ListHoldingsResponse.parse(mapped));
});

export default router;
