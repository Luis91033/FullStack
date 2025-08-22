import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        const error = new Error("El usuario ya está registrado");
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();
      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email,
        token: user.token,
      });
      res.json("Cuenta creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
      }
      user.confirm = true;
      user.token = null;
      await user.save();

      res.json("Cuenta confirmada correctamente");
    } catch (error) {}
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const userExist = await User.findOne({ where: { email } });

      if (!userExist) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      if (!userExist.confirm) {
        const error = new Error("La cuenta no ha sido confirmada");
        return res.status(403).json({ error: error.message });
      }

      if (!(await checkPassword(password, userExist.password))) {
        const error = new Error("El password es incorrecto");
        return res.status(401).json({ error: error.message });
      }

      const jwt = generateJWT(userExist.id);
      res.json(jwt);
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(401).json({ error: error.message });
      }

      user.token = generateToken();
      await user.save();

      await AuthEmail.sendPasswordResetToken({
        name: user.name,
        email,
        token: user.token,
      });
      res.json("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      res.json("Token válido");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await User.findOne({ where: { token } });
      if (!user) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      user.password = await hashPassword(password);
      user.token = null;
      await user.save();
      res.json("El password se modificó correctamente");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    try {
      const user = await User.findByPk(req.user.id);
      if (!(await checkPassword(current_password, user.password))) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(401).json({ error: error.message });
      }

      user.password = await hashPassword(password);
      await user.save();
      res.send("El password ha sido actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    try {
      const user = await User.findByPk(req.user.id);
      if (!(await checkPassword(password, user.password))) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(401).json({ error: error.message });
      }
      res.send("Password correcto");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };
}
