/** @format */
import { Request, Response } from "express";
import slug from "slug";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("El Usuario ya está registrado");
    return res.status(400).json({ error: error.message });
  }
  const handle = slug(req.body.handle, "");
  const handleExists = await User.findOne({ handle });

  if (handleExists) {
    const error = new Error("Nombre de usuario no está disponible");
    return res.status(409).json({ error: error.message });
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();
  res.status(201).send("Registro Creado Correctamente");
};

export const login = async (req: Request, res: Response) => {
  //Check if an user exists
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (!userExists) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ error: error.message });
  }

  //Check password
  if (!(await checkPassword(password, userExists.password))) {
    const error = new Error("Password incorrecto");
    return res.status(401).json({ error: error.message });
  }
};
