import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expense";

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

export const validateExpenseInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre del gasto no puede ir vacío")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("La cantidad del gasto no puede ir vacía")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((value) => value > 0)
    .withMessage("Presupuesto debe ser mayor a cero")
    .run(req);

  next();
};

export const validateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("expenseID")
    .isInt()
    .custom((value) => value > 0)
    .withMessage("ID no válido")
    .run(req);

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateExpenseExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expense = await Expense.findByPk(req.params.expenseID);
    if (!expense) {
      const error = new Error("Gasto no encontrado");
      res.status(404).json({ error: error.message });
    }
    req.expense = expense;
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
  next();
};
