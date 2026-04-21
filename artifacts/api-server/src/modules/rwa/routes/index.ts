import { Router } from "express";
import assetsRoutes from "./assets-routes";
import marketRoutes from "./market-routes";
import portfolioRoutes from "./portfolio-routes";
import transactionsRoutes from "./transactions-routes";

const rwaRouter = Router();

rwaRouter.use(assetsRoutes);
rwaRouter.use(portfolioRoutes);
rwaRouter.use(transactionsRoutes);
rwaRouter.use(marketRoutes);

export default rwaRouter;
