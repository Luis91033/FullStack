/** @format */

import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db";
import cors from "cors";
import { corsConfig } from "./config/cors";
import router from "./router";

const app = express();

connectDB();
//Cors

app.use(cors(corsConfig));

//Read data by form
app.use(express.json());

app.use("/", router);

export default app;
