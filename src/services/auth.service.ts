import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users } from '../schema/users.js';
import { LoginInput, RegisterInput } from '../validation/auth.schema.js';

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
    createdAt: users.createdAt
  });

  return newUser;
};

// --- Login Service (ADD THIS) ---
export const loginUserService = async (loginData: LoginInput) => {
  // 1. Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, loginData.email));

  // 2. If user doesn't exist, throw error
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 3. Compare the provided password with the hashed password in DB
  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // 4. Return user data (Everything except the password!)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};