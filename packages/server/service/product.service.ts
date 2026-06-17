import { productRepository } from '../repository/product.repository';
import type { Product } from '../generated/prisma/client';

type CreateProductInput = {
    name: string;
    description: string;
    price: number;
};

export const productService = {
    async getAllProducts(): Promise<Product[]> {
        return productRepository.getAll();
    },

    async createProduct(input: CreateProductInput): Promise<Product> {
        return productRepository.create(input);
    },
};
