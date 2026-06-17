import { reviewRepository } from '../repository/review.repository';
import type { Review, Summary } from '../generated/prisma/client';
import { summaryRepository } from '../repository/summary.repository';
import { NotFoundError } from '../error/NotFoundError';
import { aiService } from './ai.service';
import template from '../prompts/summarize-reviews.txt';

const getReviewsSummaryByProductId = async (
    productId: number
): Promise<string | null> => {
    const existingSummary =
        await summaryRepository.getReviewsSummaryByProductId(productId);

    return existingSummary;
};

type ReviewsResponse = {
    summary: string | null;
    reviews: Review[];
};

export const reviewService = {
    async getReviewsByProductIdOrderByCreatedAtDesc(
        productId: number,
        limit?: number
    ): Promise<ReviewsResponse> {
        const productReviews =
            await reviewRepository.getByProductIdOrderByCreatedAtDesc(
                productId,
                limit
            );

        // if (productReviews === null || productReviews.length === 0) {
        //     throw new NotFoundError(
        //         `No reviews were found for the product with id ${productId}.`
        //     );
        // }

        const existingSummary = await getReviewsSummaryByProductId(productId);

        return { summary: existingSummary, reviews: productReviews };
    },

    async generateReviewsSummaryByProductId(
        productId: number
    ): Promise<string> {
        const existingSummary =
            await summaryRepository.getReviewsSummaryByProductId(productId);

        if (existingSummary) {
            return existingSummary;
        }

        const productReviews =
            await this.getReviewsByProductIdOrderByCreatedAtDesc(productId, 10);

        const joinedReviews = productReviews.reviews
            .map((review) => review.content)
            .join('\n\n');
        const prompt = template.replace('{{reviews}}', joinedReviews);

        const summary = await aiService.getLLMResponse({ prompt });
        await summaryRepository.persistReviewSummary(
            productId,
            summary.content
        );

        return summary.content;
    },

    async createReview(
        productId: number,
        input: { author: string; rating: number; content: string }
    ): Promise<Review> {
        const review = await reviewRepository.create({
            productId,
            ...input,
        });

        // The cached summary no longer reflects this new review, so drop it
        // and let the next summary request regenerate it from scratch.
        await summaryRepository.deleteByProductId(productId);

        return review;
    },
};
