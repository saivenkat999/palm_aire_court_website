import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register API routes
  app.use('/api', apiRoutes);
  app.use('/api/admin', adminRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
