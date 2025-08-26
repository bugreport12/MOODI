import { type ChainAnalysis, type InsertChainAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getChainAnalysis(id: string): Promise<ChainAnalysis | undefined>;
  getAllChainAnalyses(): Promise<ChainAnalysis[]>;
  getChainAnalysesByMonth(year: number, month: number): Promise<ChainAnalysis[]>;
  createChainAnalysis(analysis: InsertChainAnalysis): Promise<ChainAnalysis>;
  updateChainAnalysis(id: string, updates: Partial<ChainAnalysis>): Promise<ChainAnalysis | undefined>;
  deleteChainAnalysis(id: string): Promise<boolean>;
  searchChainAnalyses(query: string): Promise<ChainAnalysis[]>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, ChainAnalysis>;

  constructor() {
    this.analyses = new Map();
  }

  async getChainAnalysis(id: string): Promise<ChainAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async getAllChainAnalyses(): Promise<ChainAnalysis[]> {
    return Array.from(this.analyses.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getChainAnalysesByMonth(year: number, month: number): Promise<ChainAnalysis[]> {
    const analyses = Array.from(this.analyses.values());
    return analyses.filter(analysis => {
      const createdAt = new Date(analysis.createdAt || 0);
      return createdAt.getFullYear() === year && createdAt.getMonth() === month - 1;
    }).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createChainAnalysis(insertAnalysis: InsertChainAnalysis): Promise<ChainAnalysis> {
    const id = randomUUID();
    const analysis: ChainAnalysis = {
      ...insertAnalysis,
      id,
      eventTime: insertAnalysis.eventTime || null,
      chainLinks: Array.isArray(insertAnalysis.chainLinks) ? insertAnalysis.chainLinks : [],
      vulnerabilities: Array.isArray(insertAnalysis.vulnerabilities) ? insertAnalysis.vulnerabilities : [],
      interventions: Array.isArray(insertAnalysis.interventions) ? insertAnalysis.interventions : [],
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async updateChainAnalysis(id: string, updates: Partial<ChainAnalysis>): Promise<ChainAnalysis | undefined> {
    const existing = this.analyses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.analyses.set(id, updated);
    return updated;
  }

  async deleteChainAnalysis(id: string): Promise<boolean> {
    return this.analyses.delete(id);
  }

  async searchChainAnalyses(query: string): Promise<ChainAnalysis[]> {
    const lowercaseQuery = query.toLowerCase();
    const analyses = Array.from(this.analyses.values());
    
    return analyses.filter(analysis => 
      analysis.title.toLowerCase().includes(lowercaseQuery) ||
      analysis.precipitatingEvent.toLowerCase().includes(lowercaseQuery) ||
      analysis.primaryEmotion.toLowerCase().includes(lowercaseQuery) ||
      (analysis.notes && analysis.notes.toLowerCase().includes(lowercaseQuery))
    ).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
}

export const storage = new MemStorage();
