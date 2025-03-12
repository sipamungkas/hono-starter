import * as jose from "jose";
import { User } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export type TokenPayload = {
  userId: number;
  email: string;
};

export const generateToken = async (user: User): Promise<string> => {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
  };

  // Convert string secret to Uint8Array
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  // Sign the JWT with the payload
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
};

export const verifyToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    // Convert string secret to Uint8Array
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    // Verify the JWT
    const { payload } = await jose.jwtVerify(token, secretKey);

    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
};
