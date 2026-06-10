import { Router } from 'express';
import type { Request, Response } from 'express';
import { reviewController } from './controller/review.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello world !!!');
});

router.get('/api/products/:id/reviews', reviewController.getReviewsByProductIdOrderByCreatedAtDesc);

export default router;
