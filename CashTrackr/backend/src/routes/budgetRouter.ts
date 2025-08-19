import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExist, validateBudgetId } from "../middleware/budget";

const router = Router();

router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExist);

router.get("/", BudgetController.getAll);

router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("amount")
    .notEmpty()
    .withMessage("La cantidad no puede ir vacía")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((value) => value > 0)
    .withMessage("Presupuesto debe ser mayor a cero"),
  handleInputErrors,
  BudgetController.create
);

router.get("/:budgetId", validateBudgetExist, BudgetController.getById);

router.put(
  "/:budgetId",
  body("name").notEmpty().withMessage("El nombre no puede ir vacío"),
  body("amount")
    .notEmpty()
    .withMessage("La cantidad no puede ir vacía")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((value) => value > 0)
    .withMessage("Presupuesto debe ser mayor a cero"),
  handleInputErrors,
  BudgetController.updateById
);
router.delete("/:budgetId", BudgetController.deleteById);

export default router;
