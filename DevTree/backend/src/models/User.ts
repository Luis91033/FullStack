/** @format */

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  handle: string;
  description: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  handle: {
    type: String,
    require: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
