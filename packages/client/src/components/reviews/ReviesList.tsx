import axios from 'axios';
import { useEffect, useState } from 'react';
import { StarRating } from './StarRating';
import Skeleton from 'react-loading-skeleton';

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            setIsLoading(true);

            const { data } = await axios.get<ReviewsResponse>(
                `/api/products/${productId}/reviews`
            );

            setReviewData(data);
        } catch (error) {
            console.error(error);
            setError('Could not fetch the reviews. Try again!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <div key={placeholder}>
                        <Skeleton width={150} />
                        <Skeleton width={100} />
                        <Skeleton count={2} />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <p className='text-red-500'>{error}</p>
    }

    return (
        <div className="flex flex-col gap-5">
            {reviewDate?.reviews.map((review) => (
                <div key={review.id}>
                    <div className="font-semibold">{review.author}</div>
                    <div>
                        <StarRating value={review.rating}></StarRating>
                    </div>
                    <div className="py-2">{review.content}</div>
                </div>
            ))}
        </div>
    );
};

export default ReviesList;
