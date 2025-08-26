import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const chainAnalyses = pgTable("chain_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time"),
  precipitatingEvent: text("precipitating_event").notNull(),
  primaryEmotion: text("primary_emotion").notNull(),
  emotionalIntensity: integer("emotional_intensity").notNull(),
  chainLinks: jsonb("chain_links").$type<ChainLink[]>().default([]),
  vulnerabilities: jsonb("vulnerabilities").$type<string[]>().default([]),
  interventions: jsonb("interventions").$type<string[]>().default([]),
  wellnessScore: integer("wellness_score"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface ChainLink {
  id: string;
  type: 'thought' | 'emotion' | 'behavior' | 'physical';
  content: string;
  order: number;
}

export const insertChainAnalysisSchema = createInsertSchema(chainAnalyses).omit({
  id: true,
  createdAt: true,
});

export const updateChainAnalysisSchema = insertChainAnalysisSchema.partial();

export type InsertChainAnalysis = z.infer<typeof insertChainAnalysisSchema>;
export type ChainAnalysis = typeof chainAnalyses.$inferSelect;
