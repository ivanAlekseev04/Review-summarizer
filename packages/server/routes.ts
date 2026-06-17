import { Router } from 'express';
import type { Request, Response } from 'express';
import { reviewController } from './controller/review.controller';
import { productController } from './controller/product.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello world !!!');
});

router.get('/api/products', productController.getAllProducts);

router.post('/api/products', productController.createProduct);

router.get(
    '/api/products/:id/reviews',
    reviewController.getReviewsByProductIdOrderByCreatedAtDesc
);

router.post('/api/products/:id/reviews', reviewController.createReview);

router.get(
    '/api/products/:id/reviews/summary',
    reviewController.getReviewsSummaryByProductId
);

export default router;
