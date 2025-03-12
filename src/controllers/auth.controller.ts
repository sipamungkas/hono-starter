import { Context } from "hono";
import * as authService from "../services/auth.service";

export const registerHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = await authService.register(body);
    return c.json(result, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const loginHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = await authService.login(body);
    return c.json(result, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 401);
  }
};

export const getCurrentUserHandler = async (c: Context) => {
  try {
    const user = c.get("user");
    const { password, ...userWithoutPassword } = user;
    return c.json(userWithoutPassword);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const updatePasswordHandler = async (c: Context) => {
  try {
    const user = c.get("user");
    const { currentPassword, newPassword } = await c.req.json();

    await authService.updatePassword(user.id, currentPassword, newPassword);

    return c.json({ message: "Password updated successfully" });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};

export const forgotPasswordHandler = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    await authService.sendPasswordResetEmail(email);

    // Don't reveal if user exists or not for security
    return c.json({ message: "If the email exists, a reset link was sent" });
  } catch (error: any) {
    // Log the error but don't reveal details to the client
    console.error(error);
    return c.json({ message: "If the email exists, a reset link was sent" });
  }
};

export const resetPasswordHandler = async (c: Context) => {
  try {
    const { token, password } = await c.req.json();
    await authService.resetPassword(token, password);

    return c.json({ message: "Password reset successfully" });
  } catch (error: any) {
    return c.json({ error: error.message }, 400);
  }
};
