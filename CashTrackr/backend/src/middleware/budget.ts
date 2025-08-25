import { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export const validateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("budgetId")
    .isInt()
    .withMessage("Id no válido")
    .custom((value) => value > 0)
    .withMessage("Id no válido")
    .run(req);

  next();
};

export const validateBudgetExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { budgetId } = req.params;
  try {
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      const error = new Error("Presupuesto no encontrado");
      res.status(404).json({ error: error.message });
    }
    req.budget = budget;
    next();
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

export const validateBudgetInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);
  await body("amount")
    .notEmpty()
    .withMessage("La cantidad no puede ir vacía")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((value) => value > 0)
    .withMessage("Presupuesto debe ser mayor a cero")
    .run(req);

  next();
};

export async function hasAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.budget.userId !== req.user.id) {
    const error = new Error("Acción no válida");
    res.status(401).json({ error: error.message });
  }

  next();
}
