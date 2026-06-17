import type { Product } from '../generated/prisma/client';
import prisma from './prisma';

type CreateProductData = {
    name: string;
    description: string;
    price: number;
};

export const productRepository = {
    async getAll(): Promise<Product[]> {
        return prisma.product.findMany();
    },

    async create(data: CreateProductData): Promise<Product> {
        return prisma.product.create({ data });
    },
};
