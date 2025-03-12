import { Context, Next } from "hono";
import { verifyToken } from "../utils/token";
import { findUserById } from "../repositories/user.repository";

export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token); // Now awaiting the token verification

  if (!payload) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Add user to context for use in route handlers
  c.set("user", user);

  await next();
};
