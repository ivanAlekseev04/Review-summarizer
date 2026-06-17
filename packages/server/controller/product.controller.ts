import type { Request, Response } from 'express';
import { productService } from '../service/product.service';

export const productController = {
    async getAllProducts(req: Request, res: Response) {
        const products = await productService.getAllProducts();

        res.json(products);
    },
};
