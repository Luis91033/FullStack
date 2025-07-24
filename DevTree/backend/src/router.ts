/** @format */

import { Router } from "express";

const router = Router();

/**Authentication and Register */
router.post("/auth/register", (req, res) => {
  res.send(req.body);
});

export default router;
