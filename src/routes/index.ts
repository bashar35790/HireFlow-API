import { Router } from "express";
import products from "../services/products";

const router = Router();
router.use("/products", products);
export default router;