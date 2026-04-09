import { and, count, desc, eq, ilike, isNull } from "drizzle-orm";
import { db } from "../config/db.js";
import { products, users } from "../schema/index.js";
import { CreateProductInput, UpdateProductInput } from "../validation/product.schema.js";

export const productService = {
  // 1. CREATE
  async create(data: CreateProductInput & { sellerId: string }) {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  },

  // 2. GET ALL (Search, Pagination, and Join)
  async getAll(page: number, limit: number, search?: string, category?: string) {
    const offset = (page - 1) * limit;
    const conditions = [isNull(products.deletedAt)];

    if (search) conditions.push(ilike(products.title, `%${search}%`));
    if (category) conditions.push(eq(products.category, category));

    // Fetch list with Seller name
    const productsList = await db.select({
      id: products.id,
      title: products.title,
      price: products.price,
      category: products.category,
      sellerId: products.sellerId,
      sellerName: users.name, // Join Logic
      createdAt: products.createdAt,
      seller: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(products.createdAt));

    // Calculate Total for Pagination Meta
    const totalResult = await db.select({ total: count() }).from(products).where(and(...conditions));
    const total = totalResult[0]?.total || 0;

    return { productsList, total };
  },

  // 3. GET BY ID
  async getById(id: string) {
    const [product] = await db.select().from(products)
      .where(and(eq(products.id, id), isNull(products.deletedAt)));
    return product;
  },

  // 4. UPDATE (Strict Ownership Check)
  async update(id: string, sellerId: string, data: UpdateProductInput) {
    const [updated] = await db.update(products)
      .set({ ...data, updatedAt: new Date() })
      .where(and(
        eq(products.id, id),
        eq(products.sellerId, sellerId),
        isNull(products.deletedAt)
      ))
      .returning();
    return updated;
  },

  // 5. DELETE (Soft Delete)
  async softDelete(id: string, sellerId: string) {
    const [deleted] = await db.update(products)
      .set({ deletedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.sellerId, sellerId)))
      .returning();
    return deleted;
  }
};