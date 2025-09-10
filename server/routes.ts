import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Register API routes
  app.use('/api', apiRoutes);
  app.use('/api/admin', adminRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
