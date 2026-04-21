import type { RequestHandler } from "express";
import { CreateTransactionBody, ListTransactionsQueryParams, ListTransactionsResponse } from "@workspace/api-zod";
import { parseRequest } from "../../../app/utils/request-parsing";
import { createTransaction, listTransactions } from "../services/transactions-service";

export const listTransactionsController: RequestHandler = async (req, res) => {
  const query = parseRequest(ListTransactionsQueryParams, req.query, res, "invalid_query") as any;
  if (!query) return;

  const transactions = await listTransactions({
    type: query.type,
    assetId: query.assetId,
    limit: query.limit ?? 50,
  });

  res.json(ListTransactionsResponse.parse(transactions));
};

export const createTransactionController: RequestHandler = async (req, res) => {
  const body = parseRequest(CreateTransactionBody, req.body, res, "invalid_body") as any;
  if (!body) return;

  const transaction = await createTransaction(body);

  if (!transaction) {
    res.status(404).json({ error: "not_found", message: "Asset not found" });
    return;
  }

  res.status(201).json(transaction);
};
