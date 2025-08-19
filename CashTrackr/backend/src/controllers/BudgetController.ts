import { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        // TODO: Filter by authenticate user
      });
      res.json(budets);
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };
  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      await budget.save();
      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  };
  static getById = async (req: Request, res: Response) => {
    res.json(req.budget);
  };
  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body);
    res.status(200).json("Actualizado correctamente");
  };
  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy();
    res.json("Presupuesto eliminado correctamente");
  };
}
