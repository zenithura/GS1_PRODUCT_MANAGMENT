import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PNG, JPG, JPEG, GIF, and WEBP are allowed."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Check if GTIN exists
  app.get("/api/products/check/:gtin", async (req, res) => {
    try {
      console.log("Checking GTIN:", req.params.gtin);
      const { gtin } = req.params;
      const product = await storage.getProductByGtin(gtin);
      console.log("Product found:", !!product);
      
      const response = {
        exists: !!product,
        product: product || null,
      };
      console.log("Sending response:", response);
      res.json(response);
    } catch (error: any) {
      console.error("Error in check endpoint:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get product by GTIN
  app.get("/api/products/gtin/:gtin", async (req, res) => {
    try {
      const { gtin } = req.params;
      const product = await storage.getProductByGtin(gtin);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create or update product
  app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
      const body = JSON.parse(req.body.data || "{}");
      
      // Validate the product data
      const validatedData = insertProductSchema.parse(body);
      
      // Check if product with this GTIN already exists
      const existingProduct = await storage.getProductByGtin(validatedData.gtin);
      
      let imageUrl: string | null = null;
      
      // Handle image upload if present
      if (req.file) {
        // Delete old image if exists and a new image is uploaded
        if (existingProduct?.imageUrl) {
          try {
            await storage.deleteImage(existingProduct.imageUrl);
          } catch (error) {
            console.error("Error deleting old image:", error);
            // Continue even if deletion fails
          }
        }
        
        const fileName = `${validatedData.gtin}-${Date.now()}.${req.file.mimetype.split("/")[1]}`;
        imageUrl = await storage.uploadImage(
          req.file.buffer,
          fileName,
          req.file.mimetype
        );
      } else if (existingProduct?.imageUrl) {
        // Preserve existing image URL if no new image is uploaded during update
        imageUrl = existingProduct.imageUrl;
      } else if (body.imageUrl) {
        // Use imageUrl from body if provided (for initial creation with existing URL)
        imageUrl = body.imageUrl;
      }
      
      const productData = {
        ...validatedData,
        imageUrl,
      };
      
      let product;
      if (existingProduct) {
        // Update existing product
        product = await storage.updateProduct(existingProduct.id, productData);
      } else {
        // Create new product
        product = await storage.createProduct(productData);
      }
      
      res.json(product);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
