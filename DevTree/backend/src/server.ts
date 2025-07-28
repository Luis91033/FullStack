/** @format */

import express from "express";
import router from "./router";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";

dotenv.config();
const app = express();

connectDB();
//Cors
app.use(cors(corsConfig));

//Read data by form
app.use(express.json());

app.use("/", router);

export default app;
