import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { productService } from "../services/product.service.js";
import { CreateProductSchema, UpdateProductSchema } from "../validation/product.schema.js";

export const createProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const validateBody = CreateProductSchema.parse(req.body);

    // Logic: Use sellerId from Body, if not present, use the one from Token
    const finalSellerId = validateBody.sellerId || req.user?.userId;

    if (!finalSellerId) {
      return reply.code(400).send({ success: false, message: "Seller ID is required" });
    }

    const product = await productService.create({
      ...validateBody,
      sellerId: finalSellerId,
    });

    return reply.code(201).send({ success: true, statusCode: 201, product });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return reply.code(400).send({ success: false, statusCode: 400, errors: error.issues });
    }
    // Log the real error to your Surat terminal so you can see why it's 500
    req.log.error(error);
    return reply.code(500).send({ success: false, statusCode: 500, message: error.message || "Internal server error" });
  }
};

export const getProductsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { page = "1", limit = "10", search, category } = req.query as any;
    const { productsList, total } = await productService.getAll(Number(page), Number(limit), search, category);

    return reply.send({
      success: true,
      statusCode: 200,
      products: productsList,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return reply.code(500).send({ success: false, message: "Internal server error" });
  }
};

export const getProductByIdHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const product = await productService.getById(id);
  if (!product) return reply.code(404).send({ success: false, statusCode: 404, message: "Product not found" });
  return reply.send({ success: true, statusCode: 200, product });
};

export const updateProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const validateBody = UpdateProductSchema.parse(req.body);
    const updated = await productService.update(id, req.user!.userId, validateBody);

    if (!updated) return reply.code(403).send({ success: false, statusCode: 403, message: "Unauthorized or not found" });

    return reply.send({ success: true, statusCode: 200, product: updated });
  } catch (error) {
    if (error instanceof ZodError) return reply.code(400).send({ success: false, errors: error.issues });
    return reply.code(500).send({ success: false, message: "Internal server error" });
  }
};

export const deleteProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const deleted = await productService.softDelete(id, req.user!.userId);

  if (!deleted) return reply.code(403).send({ success: false, statusCode: 403, message: "Unauthorized" });

  return reply.send({ success: true, statusCode: 200, message: "Product deleted successfully" });
};