import axios from 'axios';
import { StarRating } from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from "../../../components/ui/button"
import { HiSparkles } from "react-icons/hi2";

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

const ReviewsList = ({ productId }: Props) => {
    // Tanstack is replacing 'useEffect' hooks, adding retry mechanism when calling API's
    const {
        data: reviewData,
        isLoading,
        error,
    } = useQuery<ReviewsResponse>({
        queryKey: ['reviews', productId], // used for caching data
        queryFn: () => fetchReviews(),
    });

    const fetchReviews = async () => {
        const { data } = await axios.get<ReviewsResponse>(
            `/api/products/${productId}/reviews`
        );

        return data;
    };

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
        return <p className="text-red-500">Cannot render the reviews currently. Please, try again later!</p>;
    }

    if (!reviewData?.reviews.length) {
        return null;
    }

    return (
        <div>
            <div className='mb-5'>
                {reviewData?.summary ? (
                    <p>{reviewData?.summary}</p>
                ) : (
                    <Button><HiSparkles />Summarize</Button>
                )}
            </div>
            <div className="flex flex-col gap-5">
                {reviewData?.reviews.map((review) => (
                    <div key={review.id}>
                        <div className="font-semibold">{review.author}</div>
                        <div>
                            <StarRating value={review.rating}></StarRating>
                        </div>
                        <div className="py-2">{review.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsList;
