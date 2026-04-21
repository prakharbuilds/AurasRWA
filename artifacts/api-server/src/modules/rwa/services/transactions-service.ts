import { randomBytes } from "crypto";
import { assetsTable, db, holdingsTable, transactionsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

export async function listTransactions(filters: { type?: "buy" | "sell"; assetId?: number; limit: number }) {
  const { type, assetId, limit } = filters;

  let query = db
    .select({
      id: transactionsTable.id,
      assetId: transactionsTable.assetId,
      type: transactionsTable.type,
      tokens: transactionsTable.tokens,
      pricePerToken: transactionsTable.pricePerToken,
      totalAmount: transactionsTable.totalAmount,
      status: transactionsTable.status,
      txHash: transactionsTable.txHash,
      createdAt: transactionsTable.createdAt,
      assetName: assetsTable.name,
      assetSymbol: assetsTable.symbol,
    })
    .from(transactionsTable)
    .leftJoin(assetsTable, eq(transactionsTable.assetId, assetsTable.id))
    .orderBy(desc(transactionsTable.createdAt))
    .$dynamic();

  if (type) query = query.where(eq(transactionsTable.type, type));
  if (assetId) query = query.where(eq(transactionsTable.assetId, assetId));

  const transactions = await query.limit(limit);

  return transactions.map((transaction: any) => ({
    id: transaction.id,
    assetId: transaction.assetId,
    assetName: transaction.assetName ?? "",
    assetSymbol: transaction.assetSymbol ?? "",
    type: transaction.type,
    tokens: transaction.tokens,
    pricePerToken: Number(transaction.pricePerToken),
    totalAmount: Number(transaction.totalAmount),
    status: transaction.status,
    txHash: transaction.txHash ?? undefined,
    createdAt: transaction.createdAt,
  }));
}

export async function createTransaction(input: { assetId: number; type: "buy" | "sell"; tokens: number }) {
  const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.id, input.assetId));

  if (!asset) {
    return null;
  }

  const pricePerToken = Number(asset.tokenPrice);
  const totalAmount = pricePerToken * input.tokens;
  const txHash = `0x${randomBytes(32).toString("hex")}`;

  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      assetId: input.assetId,
      type: input.type,
      tokens: input.tokens,
      pricePerToken: String(pricePerToken),
      totalAmount: String(totalAmount),
      status: "completed",
      txHash,
    })
    .returning();

  const [existingHolding] = await db.select().from(holdingsTable).where(eq(holdingsTable.assetId, input.assetId));

  if (input.type === "buy") {
    if (existingHolding) {
      await db
        .update(holdingsTable)
        .set({
          tokensOwned: existingHolding.tokensOwned + input.tokens,
          purchaseValue: String(Number(existingHolding.purchaseValue) + totalAmount),
        })
        .where(eq(holdingsTable.assetId, input.assetId));
    } else {
      await db.insert(holdingsTable).values({
        assetId: input.assetId,
        tokensOwned: input.tokens,
        purchaseValue: String(totalAmount),
        pendingYield: "0",
      });
    }

    await db
      .update(assetsTable)
      .set({ availableTokens: Math.max(0, asset.availableTokens - input.tokens) })
      .where(eq(assetsTable.id, input.assetId));
  }

  if (input.type === "sell" && existingHolding) {
    const remainingTokens = Math.max(0, existingHolding.tokensOwned - input.tokens);

    if (remainingTokens === 0) {
      await db.delete(holdingsTable).where(eq(holdingsTable.assetId, input.assetId));
    } else {
      const ratio = remainingTokens / existingHolding.tokensOwned;
      await db
        .update(holdingsTable)
        .set({
          tokensOwned: remainingTokens,
          purchaseValue: String(Number(existingHolding.purchaseValue) * ratio),
        })
        .where(eq(holdingsTable.assetId, input.assetId));
    }

    await db
      .update(assetsTable)
      .set({ availableTokens: asset.availableTokens + input.tokens })
      .where(eq(assetsTable.id, input.assetId));
  }

  return {
    id: transaction.id,
    assetId: transaction.assetId,
    assetName: asset.name,
    assetSymbol: asset.symbol,
    type: transaction.type,
    tokens: transaction.tokens,
    pricePerToken: Number(transaction.pricePerToken),
    totalAmount: Number(transaction.totalAmount),
    status: transaction.status,
    txHash: transaction.txHash ?? undefined,
    createdAt: transaction.createdAt,
  };
}
