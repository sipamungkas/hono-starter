import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth.route";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Routes
app.route("/auth", authRoutes);

// Health check
app.get("/", (c) => c.json({ status: "ok" }));

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: "Internal server error" }, 500);
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
