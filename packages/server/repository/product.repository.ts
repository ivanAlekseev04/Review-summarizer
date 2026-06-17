import type { Product } from '../generated/prisma/client';
import prisma from './prisma';

export const productRepository = {
    async getAll(): Promise<Product[]> {
        return prisma.product.findMany();
    },
};
