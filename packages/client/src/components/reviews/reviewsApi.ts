import axios from 'axios';

export type Review = {
    id: number;
    author: string;
    content: string;
    rating: number;
    createdAt: string;
};

export type ReviewsResponse = {
    summary: string | null;
    reviews: Review[];
};

export type SummarizeResponse = {
    summary: string;
};

export type CreateReviewInput = {
    author: string;
    rating: number;
    content: string;
};

export const reviewsApi = {
    fetchReviews(productId: number) {
        return axios
            .get<ReviewsResponse>(`/api/products/${productId}/reviews`)
            .then((res) => res.data);
    },

    summarizeReviews(productId: number) {
        return axios
            .get<SummarizeResponse>(
                `/api/products/${productId}/reviews/summary`
            )
            .then((res) => res.data);
    },

    createReview(productId: number, input: CreateReviewInput) {
        return axios
            .post<Review>(`/api/products/${productId}/reviews`, input)
            .then((res) => res.data);
    },
};
