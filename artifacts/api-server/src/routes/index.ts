import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assetsRouter from "./assets";
import portfolioRouter from "./portfolio";
import transactionsRouter from "./transactions";
import marketRouter from "./market";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assetsRouter);
router.use(portfolioRouter);
router.use(transactionsRouter);
router.use(marketRouter);

export default router;
