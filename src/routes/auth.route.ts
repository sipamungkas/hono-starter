import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

// Create a new Hono instance for auth routes
const authRoutes = new Hono();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string(),
});

// Public routes
authRoutes.post(
  "/register",
  zValidator("json", registerSchema),
  authController.registerHandler
);

authRoutes.post(
  "/login",
  zValidator("json", loginSchema),
  authController.loginHandler
);

// Password reset routes
authRoutes.post(
  "/forgot-password",
  zValidator(
    "json",
    z.object({
      email: z.string().email("Invalid email format"),
    })
  ),
  authController.forgotPasswordHandler
);

authRoutes.post(
  "/reset-password",
  zValidator(
    "json",
    z.object({
      token: z.string(),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })
  ),
  authController.resetPasswordHandler
);

// Protected routes
authRoutes.use("/me", authenticate);
authRoutes.use("/update-password", authenticate);

authRoutes.get("/me", authController.getCurrentUserHandler);

authRoutes.patch(
  "/update-password",
  zValidator(
    "json",
    z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
  ),
  authController.updatePasswordHandler
);

// Admin routes (example)
authRoutes.use("/admin/*", authenticate, async (c, next) => {
  const user = c.get("user");
  // This is a placeholder - you would implement proper role check
  if (!user.isAdmin) {
    return c.json({ error: "Forbidden" }, 403);
  }
  await next();
});

export default authRoutes;
