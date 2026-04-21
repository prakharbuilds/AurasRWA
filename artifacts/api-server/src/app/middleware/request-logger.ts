import type { Express } from "express";
import pinoHttp from "pino-http";
import { logger } from "../../lib/logger";

export function registerRequestLogger(app: Express): void {
  app.use(
    pinoHttp({
      logger,
      serializers: {
        req(req) {
          return {
            id: req.id,
            method: req.method,
            url: req.url?.split("?")[0],
          };
        },
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
    }),
  );
}
