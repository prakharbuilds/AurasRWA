import { Router } from "express";
import healthRoutes from "./health-routes";
import authModule from "../../modules/auth";
import aiModule from "../../modules/ai";
import rwaModule from "../../modules/rwa/routes";

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use(authModule);
apiRouter.use(rwaModule);
apiRouter.use(aiModule);

export default apiRouter;
