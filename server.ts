import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // MongoDB Connection (Lazy)
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    console.log("Attempting to connect to MongoDB...");
    mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
      .then(() => console.log("✅ Connected to MongoDB successfully"))
      .catch(err => {
        console.error("❌ MongoDB connection error details:");
        console.error("- Message:", err.message);
        console.error("- Code:", err.code);
        if (err.message.includes("ENOTFOUND")) {
          console.error("💡 TIP: This is a DNS error. Check if your MONGODB_URI is correct or try the 'Standard Connection String' (Node.js 2.2.12 format) from Atlas.");
        }
      });
  } else {
    console.warn("⚠️ MONGODB_URI not provided. Database features will be unavailable.");
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth Routes (Placeholder)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Simple mock for now
    if (email === "admin@gyaan.com" && password === "admin123") {
      return res.json({
        token: "mock-jwt-token",
        user: { id: "1", name: "Admin", email: "admin@gyaan.com", role: "admin" }
      });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
