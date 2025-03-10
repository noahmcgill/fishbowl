import bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";

export async function hash(plainTextPassword: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(plainTextPassword, saltRounds);
}

export async function verify(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export const generateApiKey = () => {
  return createId();
};
