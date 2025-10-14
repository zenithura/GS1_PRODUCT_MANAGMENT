import { type Product, type InsertProduct } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product operations
  getProduct(id: string): Promise<Product | undefined>;
  getProductByGtin(gtin: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getAllProducts(): Promise<Product[]>;
  // Image operations
  uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string>;
  deleteImage(imageUrl: string): Promise<void>;
}

// Helper function to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  const camelObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelObj[camelKey] = typeof value === 'object' ? toCamelCase(value) : value;
  }
  return camelObj;
}

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  
  const snakeObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeObj[snakeKey] = typeof value === 'object' ? toSnakeCase(value) : value;
  }
  return snakeObj;
}

export class SupabaseStorage implements IStorage {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log("Initializing Supabase storage...");
    console.log("SUPABASE_URL exists:", !!supabaseUrl);
    console.log("SUPABASE_ANON_KEY exists:", !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client created successfully");
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return undefined;
    }

    return toCamelCase(data) as Product;
  }

  async getProductByGtin(gtin: string): Promise<Product | undefined> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("gtin", gtin)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return undefined;
      }
      console.error("Error fetching product by GTIN:", error);
      return undefined;
    }

    return toCamelCase(data) as Product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = `prod_${randomUUID()}`;
    const productData = { ...insertProduct, id };
    
    // Convert to snake_case for database
    const dbData = toSnakeCase(productData);

    const { data, error } = await this.supabase
      .from("products")
      .insert(dbData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }

    return toCamelCase(data) as Product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    // Convert to snake_case for database
    const dbData = toSnakeCase(updateData);
    
    const { data, error } = await this.supabase
      .from("products")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }

    return toCamelCase(data) as Product;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return toCamelCase(data) as Product[];
  }

  async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the public URL
      // Example URL: https://xxx.supabase.co/storage/v1/object/public/product-images/filename.jpg
      const urlParts = imageUrl.split("/product-images/");
      if (urlParts.length < 2) {
        console.warn("Invalid image URL format:", imageUrl);
        return;
      }
      
      const filePath = urlParts[1];
      
      const { error } = await this.supabase.storage
        .from("product-images")
        .remove([filePath]);

      if (error) {
        console.error(`Error deleting image: ${error.message}`);
        // Don't throw, just log the error
      }
    } catch (error) {
      console.error("Error in deleteImage:", error);
      // Don't throw, just log the error
    }
  }
}

export const storage = new SupabaseStorage();
