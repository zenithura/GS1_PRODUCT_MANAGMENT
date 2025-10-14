import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  gtin: text("gtin").notNull().unique(),
  productName: text("product_name").notNull(),
  brand: text("brand"),
  category: text("category"),
  description: text("description"),
  weight: text("weight"),
  origin: text("origin"),
  imageUrl: text("image_url"),
  extraTables: jsonb("extra_tables").$type<ExtraTable[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExtraTable = {
  title: string;
  rows: { key: string; value: string }[];
};

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
