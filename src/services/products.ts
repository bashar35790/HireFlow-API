import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

// for post new product 
router.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  console.log("Received product data:", body); // Log the received product data
  try {
    const data = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock ?? body.Stock,
      },
    });
    res.json({
      success: true,
      message: "Product created successfully",
      data: data,
  
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: (error as Error).message,
    });
  }
});

// for get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await prisma.product.findMany();
    res.json({
      success: true,
      message: "Products retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: (error as Error).message,
    });
  }
});

export default router;  

