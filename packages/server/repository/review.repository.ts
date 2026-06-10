import type { Review } from '../generated/prisma/client';
import prisma from '../repository/prisma';

export const reviewRepository = {
    async getByProductIdOrderByCreatedAtDesc(
        productId: number
    ): Promise<Review[]> {
        return prisma.review.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
        });
    },
};
