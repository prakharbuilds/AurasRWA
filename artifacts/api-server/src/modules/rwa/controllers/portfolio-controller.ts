import type { RequestHandler } from "express";
import { GetPortfolioResponse, ListHoldingsResponse } from "@workspace/api-zod";
import { getPortfolioSummary, listHoldings } from "../services/portfolio-service";

export const getPortfolioController: RequestHandler = async (_req, res) => {
  const summary = await getPortfolioSummary();
  res.json(GetPortfolioResponse.parse(summary));
};

export const listHoldingsController: RequestHandler = async (_req, res) => {
  const holdings = await listHoldings();
  res.json(ListHoldingsResponse.parse(holdings));
};
