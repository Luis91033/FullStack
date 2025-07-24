/** @format */

import express from "express";
import router from "./router";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();
const app = express();

connectDB();

//Read data by form
app.use(express.json());

app.use("/", router);

export default app;
