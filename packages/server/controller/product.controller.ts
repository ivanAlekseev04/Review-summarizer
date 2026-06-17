import type { Request, Response } from 'express';
import z from 'zod';
import { productService } from '../service/product.service';

const createProductSchema = z.object({
    name: z.string().trim().min(1, 'Name cannot be empty.'),
    description: z.string().trim().min(1, 'Description cannot be empty.'),
    price: z.coerce.number().positive('Price must be greater than 0.'),
});

export const productController = {
    async getAllProducts(req: Request, res: Response) {
        const products = await productService.getAllProducts();

        res.json(products);
    },

    async createProduct(req: Request, res: Response) {
        const parsed = createProductSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.issues[0]?.message });
            return;
        }

        const product = await productService.createProduct(parsed.data);

        res.status(201).json(product);
    },
};
