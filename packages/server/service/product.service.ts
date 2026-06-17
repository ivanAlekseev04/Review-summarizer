import { productRepository } from '../repository/product.repository';
import type { Product } from '../generated/prisma/client';

export const productService = {
    async getAllProducts(): Promise<Product[]> {
        return productRepository.getAll();
    },
};
