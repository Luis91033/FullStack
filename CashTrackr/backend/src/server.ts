import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { connectDB } from "./config/db";
import router from "./routes/budgetRouter";

connectDB();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/budgets", router);

export default app;
