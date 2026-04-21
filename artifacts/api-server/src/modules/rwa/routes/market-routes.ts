import { Router } from "express";
import { getMarketStatsController, getPriceHistoryController } from "../controllers/market-controller";

const marketRouter = Router();

marketRouter.get("/market/stats", getMarketStatsController);
marketRouter.get("/market/price-history/:assetId", getPriceHistoryController);

export default marketRouter;
