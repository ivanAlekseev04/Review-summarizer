import type { Request, Response } from 'express';
import { reviewService } from '../service/review.service';
import z from 'zod';

const pathParamsSchema = z.object({
    id: z.coerce.number().int().nonnegative(), // With "z.coerce.number()" we are telling Zod "Firstly convert this value to a number type, and then operate with it"
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
};
