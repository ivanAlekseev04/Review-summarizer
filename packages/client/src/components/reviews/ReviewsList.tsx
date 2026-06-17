import axios from 'axios';
import { StarRating } from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../../../components/ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';

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

type SummarizeResponse = {
    summary: string;
};

const ReviewsList = ({ productId }: Props) => {
    const {
        mutate: handleSummarize,
        isPending: isSummaryLoading,
        isError: isSummaryError,
        data: summarizeResponse,
    } = useMutation<SummarizeResponse>({
        mutationFn: () => summarizeReviews(),
    });

    // Tanstack is replacing 'useEffect' hooks, adding retry mechanism when calling API's
    const {
        data: reviewData,
        isLoading,
        error,
    } = useQuery<ReviewsResponse>({
        queryKey: ['reviews', productId], // used for caching data
        queryFn: () => fetchReviews(),
    });

    const summarizeReviews = async () => {
        const { data } = await axios.get<SummarizeResponse>(
            `/api/products/${productId}/reviews/summary`
        );

        return data;
    };

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
                    <ReviewSkeleton key={placeholder} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-red-500">
                Cannot render the reviews currently. Please, try again later!
            </p>
        );
    }

    if (!reviewData?.reviews.length) {
        return null;
    }

    const currentSummary = reviewData.summary || summarizeResponse?.summary;

    return (
        <div>
            <div className="mb-5">
                {currentSummary ? (
                    <p>{currentSummary}</p>
                ) : (
                    <div>
                        <Button
                            onClick={() => handleSummarize()}
                            className="cursor-pointer"
                            disabled={isSummaryLoading}
                        >
                            <HiSparkles />
                            Summarize
                        </Button>
                        {isSummaryLoading && (
                            <div className="py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {isSummaryError && (
                            <p className="text-red-500">Could not summarize reviews. Try again!</p>
                        )}
                    </div>
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
