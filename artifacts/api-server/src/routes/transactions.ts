import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, transactionsTable, assetsTable, holdingsTable } from "@workspace/db";
import {
  ListTransactionsQueryParams,
  ListTransactionsResponse,
  CreateTransactionBody,
} from "@workspace/api-zod";
import { randomBytes } from "crypto";

const router: IRouter = Router();

router.get("/transactions", async (req, res): Promise<void> => {
  const query = ListTransactionsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "invalid_query", message: query.error.message });
    return;
  }

  const { type, assetId, limit = 50 } = query.data;

  let baseQuery = db
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

  if (type) {
    baseQuery = baseQuery.where(eq(transactionsTable.type, type));
  }
  if (assetId) {
    baseQuery = baseQuery.where(eq(transactionsTable.assetId, assetId));
  }

  const txs = await baseQuery.limit(limit);

  const mapped = txs.map((t) => ({
    id: t.id,
    assetId: t.assetId,
    assetName: t.assetName ?? "",
    assetSymbol: t.assetSymbol ?? "",
    type: t.type,
    tokens: t.tokens,
    pricePerToken: Number(t.pricePerToken),
    totalAmount: Number(t.totalAmount),
    status: t.status,
    txHash: t.txHash ?? undefined,
    createdAt: t.createdAt,
  }));

  res.json(ListTransactionsResponse.parse(mapped));
});

router.post("/transactions", async (req, res): Promise<void> => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", message: parsed.error.message });
    return;
  }

  const { assetId, type, tokens } = parsed.data;

  const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.id, assetId));
  if (!asset) {
    res.status(404).json({ error: "not_found", message: "Asset not found" });
    return;
  }

  const pricePerToken = Number(asset.tokenPrice);
  const totalAmount = pricePerToken * tokens;
  const txHash = "0x" + randomBytes(32).toString("hex");

  const [tx] = await db
    .insert(transactionsTable)
    .values({
      assetId,
      type,
      tokens,
      pricePerToken: String(pricePerToken),
      totalAmount: String(totalAmount),
      status: "completed",
      txHash,
    })
    .returning();

  const [existing] = await db.select().from(holdingsTable).where(eq(holdingsTable.assetId, assetId));

  if (type === "buy") {
    if (existing) {
      await db
        .update(holdingsTable)
        .set({
          tokensOwned: existing.tokensOwned + tokens,
          purchaseValue: String(Number(existing.purchaseValue) + totalAmount),
        })
        .where(eq(holdingsTable.assetId, assetId));
    } else {
      await db.insert(holdingsTable).values({
        assetId,
        tokensOwned: tokens,
        purchaseValue: String(totalAmount),
        pendingYield: "0",
      });
    }
    await db
      .update(assetsTable)
      .set({ availableTokens: Math.max(0, asset.availableTokens - tokens) })
      .where(eq(assetsTable.id, assetId));
  } else if (type === "sell" && existing) {
    const newTokens = Math.max(0, existing.tokensOwned - tokens);
    if (newTokens === 0) {
      await db.delete(holdingsTable).where(eq(holdingsTable.assetId, assetId));
    } else {
      const ratio = newTokens / existing.tokensOwned;
      await db
        .update(holdingsTable)
        .set({
          tokensOwned: newTokens,
          purchaseValue: String(Number(existing.purchaseValue) * ratio),
        })
        .where(eq(holdingsTable.assetId, assetId));
    }
    await db
      .update(assetsTable)
      .set({ availableTokens: asset.availableTokens + tokens })
      .where(eq(assetsTable.id, assetId));
  }

  res.status(201).json({
    id: tx.id,
    assetId: tx.assetId,
    assetName: asset.name,
    assetSymbol: asset.symbol,
    type: tx.type,
    tokens: tx.tokens,
    pricePerToken: Number(tx.pricePerToken),
    totalAmount: Number(tx.totalAmount),
    status: tx.status,
    txHash: tx.txHash ?? undefined,
    createdAt: tx.createdAt,
  });
});

export default router;
