import { Router } from "express";
import { createAssetController, getAssetController, listAssetsController } from "../controllers/assets-controller";

const assetsRouter = Router();

assetsRouter.get("/assets", listAssetsController);
assetsRouter.post("/assets", createAssetController);
assetsRouter.get("/assets/:id", getAssetController);

export default assetsRouter;
