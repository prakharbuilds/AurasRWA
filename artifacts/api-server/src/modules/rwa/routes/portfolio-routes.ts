import { Router } from "express";
import { getPortfolioController, listHoldingsController } from "../controllers/portfolio-controller";

const portfolioRouter = Router();

portfolioRouter.get("/portfolio", getPortfolioController);
portfolioRouter.get("/portfolio/holdings", listHoldingsController);

export default portfolioRouter;
