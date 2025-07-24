/** @format */

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `Mongo db conectado en ${connection.connection.host}:${connection.connection.port}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
