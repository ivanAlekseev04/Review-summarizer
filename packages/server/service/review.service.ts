import { reviewRepository } from '../repository/review.repository';
import type { Review } from '../generated/prisma/client';

export const reviewService = {
    async getReviewsByProductIdOrderByCreatedAtDesc(
        productId: number
    ): Promise<Review[]> {
        return reviewRepository.getByProductIdOrderByCreatedAtDesc(productId);
    },
};
