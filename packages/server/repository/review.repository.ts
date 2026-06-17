import type { Review } from '../generated/prisma/client';
import prisma from '../repository/prisma';

type CreateReviewData = {
    productId: number;
    author: string;
    rating: number;
    content: string;
};

export const reviewRepository = {
    async getByProductIdOrderByCreatedAtDesc(
        productId: number,
        limit?: number
    ): Promise<Review[]> {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },

    async create(data: CreateReviewData): Promise<Review> {
        return prisma.review.create({ data });
    },
};
