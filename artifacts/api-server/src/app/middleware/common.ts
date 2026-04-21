import express, { type Express } from "express";
import cors from "cors";

export function registerCommonMiddleware(app: Express): void {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
