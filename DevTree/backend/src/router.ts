/** @format */

import { Router } from "express";
import { createAccount, getUser, login, updateProfile } from "./handlers";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router();

/**Authentication and Register */
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no debe ir vacío"),
  body("name").notEmpty().withMessage("El nombre no debe ir vacío"),
  body("email").isEmail().withMessage("Email no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, mínimo 8 caractéres"),
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("Email no válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleInputErrors,
  login
);

router.get("/user", authenticate, getUser);

router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no debe ir vacío"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no puede ir vacía"),
  handleInputErrors,
  authenticate,
  updateProfile
);
export default router;
