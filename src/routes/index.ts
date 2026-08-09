import { Router } from "express";

const router = Router();
router.use("/products" , require("./products"));
export default router;

