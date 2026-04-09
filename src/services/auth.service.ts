import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users } from '../schema/index.js';

export const registerUserService = async (userData: any) => {
  const email = userData.email.toLowerCase().trim();

  // 1. Check if user already exists
  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // 3. Insert into PostgreSQL (Using your lean schema columns)
  const [newUser] = await db.insert(users).values({
    name: userData.name, // Matches your schema 'name'
    email,
    password: hashedPassword,
  }).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt: users.createdAt // Matches your schema 'createdAt'
  });

  return newUser;
};

export const loginUserService = async (loginData: any) => {
  const email = loginData.email.toLowerCase().trim();

  // 1. Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare passwords
  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // 3. Return safe user data (Strictly no password)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};