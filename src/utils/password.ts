import * as bcrypt from "bcryptjs";

// Using bcryptjs for password hashing
export const hashPassword = async (password: string): Promise<string> => {
  // Generate a salt and hash the password (10 is the recommended salt rounds)
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  // Compare the input password with the stored hash
  return await bcrypt.compare(password, hashedPassword);
};
