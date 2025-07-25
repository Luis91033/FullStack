/** @format */

import { Router } from "express";
import { createAccount, login } from "./handlers";
import { body } from "express-validator";
import { handleInputErrors } from "./middleware/validation";

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
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es obligatorio"),
  handleInputErrors,
  login
);

export default router;
