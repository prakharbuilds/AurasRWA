import { assetsTable, db, holdingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from "../../../app/config/category-colors";

export async function getPortfolioSummary() {
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

  for (const holding of holdings) {
    const currentValue = holding.tokensOwned * Number(holding.tokenPrice ?? 0);
    totalValue += currentValue;
    totalInvested += Number(holding.purchaseValue);
    totalPendingYield += Number(holding.pendingYield);

    const category = holding.assetCategory ?? "other";
    if (!categoryMap[category]) {
      categoryMap[category] = {
        value: 0,
        color: CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR,
      };
    }
    categoryMap[category].value += currentValue;
  }

  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const allocationByCategory = Object.entries(categoryMap).map(([category, { value, color }]) => ({
    category,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    color,
  }));

  const now = new Date();
  const performanceHistory = Array.from({ length: 30 }, (_, index) => {
    const day = new Date(now);
    day.setDate(day.getDate() - (29 - index));
    const factor = 1 + (Math.random() - 0.48) * 0.02;

    return {
      date: day.toISOString().split("T")[0],
      value: Math.round(totalValue * (0.85 + (index / 30) * 0.15) * factor),
    };
  });

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    totalPendingYield,
    allocationByCategory,
    performanceHistory,
  };
}

export async function listHoldings() {
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

  return holdings.map((holding: any) => {
    const currentValue = holding.tokensOwned * Number(holding.tokenPrice ?? 0);
    const purchaseValue = Number(holding.purchaseValue);
    const gainLoss = currentValue - purchaseValue;

    return {
      id: holding.id,
      assetId: holding.assetId,
      assetName: holding.assetName ?? "",
      assetSymbol: holding.assetSymbol ?? "",
      assetCategory: holding.assetCategory ?? "",
      tokensOwned: holding.tokensOwned,
      currentValue,
      purchaseValue,
      gainLoss,
      gainLossPercent: purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0,
      annualYield: Number(holding.annualYield ?? 0),
      pendingYield: Number(holding.pendingYield),
    };
  });
}
