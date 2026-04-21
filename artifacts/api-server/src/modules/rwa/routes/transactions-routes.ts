import { Router } from "express";
import { createTransactionController, listTransactionsController } from "../controllers/transactions-controller";

const transactionsRouter = Router();

transactionsRouter.get("/transactions", listTransactionsController);
transactionsRouter.post("/transactions", createTransactionController);

export default transactionsRouter;
