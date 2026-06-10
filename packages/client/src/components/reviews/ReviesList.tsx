import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
    productId: number;
};

type Review = {
    id: number;
    author: string;
    content: string;
    rating: number;
    createdAt: string;
};

type ReviewsResponse = {
    summary: string | null;
    reviews: Review[];
};

const ReviesList = ({ productId }: Props) => {
    const [reviewDate, setReviewData] = useState<ReviewsResponse>();

    const fetchReviews = async () => {
        const { data } = await axios.get<ReviewsResponse>(
            `/api/products/${productId}/reviews`
        );
        setReviewData(data);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className='flex flex-col gap-5'>
            {reviewDate?.reviews.map(review => (
                <div key={review.id}>
                    <div className='font-semibold'>{review.author}</div>
                    <div>Rating: {review.rating}/5</div>
                    <div className='py-2'>{review.content}</div>
                </div>
            ))}
        </div>
    );
};

export default ReviesList;
