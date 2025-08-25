import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import {
  hasAccess,
  validateBudgetExist,
  validateBudgetId,
  validateBudgetInput,
} from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import {
  validateExpenseExist,
  validateExpenseId,
  validateExpenseInput,
} from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExist);
router.param("budgetId", hasAccess);

router.param("expenseID", validateExpenseId);
router.param("expenseID", validateExpenseExist);

router.get("/", BudgetController.getAll);

router.post(
  "/",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create
);

router.get("/:budgetId", validateBudgetExist, BudgetController.getById);

router.put(
  "/:budgetId",
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateById
);
router.delete("/:budgetId", BudgetController.deleteById);

//Expenses routes
router.post(
  "/:budgetId/expenses",
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.create
);
router.get("/:budgetId/expenses/:expenseID", ExpensesController.getById);
router.put(
  "/:budgetId/expenses/:expenseID",
  validateExpenseInput,
  handleInputErrors,
  ExpensesController.updateById
);
router.delete("/:budgetId/expenses/:expenseID", ExpensesController.deleteById);

export default router;
