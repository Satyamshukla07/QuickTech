import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  role: text("role").notNull().default("user"),
  referral_code: text("referral_code").unique(),
  referred_by: integer("referred_by").references(() => users.id),
  referral_rewards: integer("referral_rewards").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  address: true,
}).extend({
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  processing_time: text("processing_time").notNull(),
  requirements: text("requirements").notNull(),
  icon: text("icon").notNull(),
  badge: text("badge"),
  badge_color: text("badge_color"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  category: true,
  price: true,
  processing_time: true,
  requirements: true,
  icon: true,
  badge: true,
  badge_color: true,
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  service_id: integer("service_id").notNull(),
  status: text("status").notNull().default("pending"),
  documents: jsonb("documents").notNull(),
  total_amount: integer("total_amount").notNull(),
  payment_status: text("payment_status").notNull().default("pending"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  user_id: true,
  service_id: true,
  documents: true,
  total_amount: true,
  notes: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Extended schemas with validations
export const extendedRegisterUserSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginUser = z.infer<typeof loginUserSchema>;
