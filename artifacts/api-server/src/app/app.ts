import express, { type Express } from "express";
import apiRouter from "./routes";
import { registerCommonMiddleware } from "./middleware/common";
import { registerRequestLogger } from "./middleware/request-logger";

export function createApp(): Express {
  const app = express();

  registerRequestLogger(app);
  registerCommonMiddleware(app);

  app.use("/api", apiRouter);

  return app;
}
