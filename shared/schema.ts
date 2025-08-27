import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  path: text("path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  status: text("status").notNull().default("uploaded"), // uploaded, processing, completed, error
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  userId: varchar("user_id"), // Optional for now
  patientInfo: jsonb("patient_info"), // Store patient metadata as JSON
  results: jsonb("results"), // ML analysis results when available
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  filename: true,
  originalName: true,
  path: true,
  fileSize: true,
  mimeType: true,
  patientInfo: true,
}).extend({
  patientInfo: z.object({
    patientId: z.string().optional(),
    age: z.number().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    scanType: z.enum(["t1", "t2", "flair", "dwi"]).optional(),
    clinicalNotes: z.string().optional(),
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
