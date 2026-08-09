import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// for post new product 
router.post("/products", async (req, res) => {
  const productData = req.body;
  const data = await prisma.product.create({ data: productData });
  try {
    res.json({
      success: true,
      message: "Product created successfully",
      data: data,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to create product",
      error: error,
    });
  }
});

export default router;  

