import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateToken } from "../utils/token";
import * as jose from "jose";
import { NewUser, User } from "../models/user.model";

export type AuthResult = {
  user: Omit<User, "password">;
  token: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name?: string;
};

export const register = async (data: RegisterData): Promise<AuthResult> => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const newUser: NewUser = {
    email: data.email,
    password: hashedPassword,
    name: data.name,
  };

  const user = await createUser(newUser);
  const token = await generateToken(user);

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResult> => {
  const user = await findUserByEmail(credentials.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await verifyPassword(
    user.password,
    credentials.password
  );
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  const token = await generateToken(user);

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await verifyPassword(user.password, currentPassword);
  if (!isValidPassword) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);

  await updateUser(userId, {
    password: hashedPassword,
    updatedAt: new Date(),
  });
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists or not
    return;
  }

  // Generate reset token
  const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key"
  );
  const resetToken = await new jose.SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // Short expiration time for security
    .sign(secretKey);

  // In a real application, you would send an email with the reset link
  // For this example, we'll just log it
  console.log(
    `Password reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
  );

  // You could also store the token in the database with an expiration
  // This example assumes you're using the JWT expiration for simplicity
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    // Verify the token
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const { payload } = await jose.jwtVerify(token, secretKey);

    const userId = (payload as any).userId;
    if (!userId) {
      throw new Error("Invalid token");
    }

    // Find the user
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update the password
    const hashedPassword = await hashPassword(newPassword);
    await updateUser(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
