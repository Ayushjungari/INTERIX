import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import codeRoutes from "./routes/codeRoutes.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json({ limit: "1mb" }));

// In production the frontend is served from the same origin as the API, so a
// missing CLIENT_URL must not break requests. Same-origin requests send no
// Origin header; cross-origin requests are matched against CLIENT_URL.
const allowedOrigins = (ENV.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

app.use(clerkMiddleware());

// API routes are registered BEFORE the SPA fallback below.
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/code", codeRoutes);

app.get("/health", (_req, res) => res.status(200).json({ msg: "api is up and running" }));

// Any unmatched /api/* request must return JSON 404, never index.html.
app.use("/api", (_req, res) => res.status(404).json({ message: "API route not found" }));

if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  app.get("/{*any}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
