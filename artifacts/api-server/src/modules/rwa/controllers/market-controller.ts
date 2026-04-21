import type { RequestHandler } from "express";
import { GetMarketStatsResponse, GetPriceHistoryParams, GetPriceHistoryQueryParams, GetPriceHistoryResponse } from "@workspace/api-zod";
import { parseRequest } from "../../../app/utils/request-parsing";
import { getAssetPriceHistory, getMarketStats } from "../services/market-service";

export const getMarketStatsController: RequestHandler = async (_req, res) => {
  const stats = await getMarketStats();
  res.json(GetMarketStatsResponse.parse(stats));
};

export const getPriceHistoryController: RequestHandler = async (req, res) => {
  const params = parseRequest(GetPriceHistoryParams, req.params, res, "invalid_params") as any;
  if (!params) return;

  const query = GetPriceHistoryQueryParams.safeParse(req.query);
  const days = query.success ? (query.data.days ?? 30) : 30;

  const history = await getAssetPriceHistory(params.assetId, days);

  if (!history) {
    res.status(404).json({ error: "not_found", message: "Asset not found" });
    return;
  }

  res.json(GetPriceHistoryResponse.parse(history));
};
