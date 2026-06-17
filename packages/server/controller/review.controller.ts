import type { Request, Response } from 'express';
import { reviewService } from '../service/review.service';
import z from 'zod';

const pathParamsSchema = z.object({
    id: z.coerce.number().int().nonnegative(), // With "z.coerce.number()" we are telling Zod "Firstly convert this value to a number type, and then operate with it"
});

const createReviewSchema = z.object({
    author: z.string().trim().min(1, 'Client name cannot be empty.'),
    rating: z.coerce
        .number()
        .int('Stars must be a whole number.')
        .min(0, 'Stars must be from 0 to 5.')
        .max(5, 'Stars must be from 0 to 5.'),
    content: z.string().trim().min(1, 'Description cannot be empty.'),
});

export const reviewController = {
    async getReviewsByProductIdOrderByCreatedAtDesc(
        req: Request,
        res: Response
    ) {
        const parsed = pathParamsSchema.safeParse(req.params);

        if (!parsed.success) {
            res.status(400).json({ error: 'Invalid product ID.' });
            return;
        }

        const reviews =
            await reviewService.getReviewsByProductIdOrderByCreatedAtDesc(
                parsed.data.id
            );

        res.json(reviews);
    },

    async getReviewsSummaryByProductId(req: Request, res: Response) {
        const parsed = pathParamsSchema.safeParse(req.params);

        if (!parsed.success) {
            res.status(400).json({ error: 'Invalid product ID.' });
            return;
        }

        const summary = await reviewService.generateReviewsSummaryByProductId(
            parsed.data.id
        );

        res.json({ summary });
    },

    async createReview(req: Request, res: Response) {
        const parsedParams = pathParamsSchema.safeParse(req.params);

        if (!parsedParams.success) {
            res.status(400).json({ error: 'Invalid product ID.' });
            return;
        }

        const parsedBody = createReviewSchema.safeParse(req.body);

        if (!parsedBody.success) {
            res.status(400).json({
                error: parsedBody.error.issues[0]?.message,
            });
            return;
        }

        const review = await reviewService.createReview(
            parsedParams.data.id,
            parsedBody.data
        );

        res.status(201).json(review);
    },
};
