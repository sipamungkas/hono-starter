import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { users, User, NewUser } from "../models/user.model";

export const findUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0];
};

export const findUserById = async (id: number): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
};

export const createUser = async (user: NewUser): Promise<User> => {
  const result = await db.insert(users).values(user).returning();
  return result[0];
};

export const updateUser = async (
  id: number,
  user: Partial<User>
): Promise<User | undefined> => {
  const result = await db
    .update(users)
    .set({ ...user, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });
  return result.length > 0;
};
