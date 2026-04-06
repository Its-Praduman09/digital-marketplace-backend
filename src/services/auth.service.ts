import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users } from '../schema/users.js';
import { RegisterInput } from '../validation/auth.schema.js';

export const registerUserService = async (userData: RegisterInput) => {
  // 1. Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, userData.email));

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // 3. Insert into PostgreSQL
  const [newUser] = await db.insert(users).values({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
  }).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt:users.createdAt
  });

  return newUser;
};