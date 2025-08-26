import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChainAnalysisSchema, updateChainAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chain analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllChainAnalyses();
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching analyses" });
    }
  });

  // Get analyses by month
  app.get("/api/analyses/month/:year/:month", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid year or month" });
      }
      
      const analyses = await storage.getChainAnalysesByMonth(year, month);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching monthly analyses" });
    }
  });

  // Search analyses
  app.get("/api/analyses/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const analyses = await storage.searchChainAnalyses(query);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Error searching analyses" });
    }
  });

  // Get single analysis
  app.get("/api/analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getChainAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Error fetching analysis" });
    }
  });

  // Create new analysis
  app.post("/api/analyses", async (req, res) => {
    try {
      const validatedData = insertChainAnalysisSchema.parse(req.body);
      const analysis = await storage.createChainAnalysis(validatedData);
      res.status(201).json(analysis);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data format", details: error });
      }
      res.status(500).json({ message: "Error creating analysis" });
    }
  });

  // Update analysis
  app.patch("/api/analyses/:id", async (req, res) => {
    try {
      const validatedData = updateChainAnalysisSchema.parse(req.body);
      const analysis = await storage.updateChainAnalysis(req.params.id, validatedData);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid data format", details: error });
      }
      res.status(500).json({ message: "Error updating analysis" });
    }
  });

  // Delete analysis
  app.delete("/api/analyses/:id", async (req, res) => {
    try {
      const success = await storage.deleteChainAnalysis(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      res.json({ message: "Analysis deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
