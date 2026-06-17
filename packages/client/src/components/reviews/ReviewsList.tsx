import { StarRating } from './StarRating';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';
import AddReviewDialog from './AddReviewDialog';
import {
    reviewsApi,
    type ReviewsResponse,
    type SummarizeResponse,
} from './reviewsApi';

type Props = {
    productId: number;
};

const ReviewsList = ({ productId }: Props) => {
    const queryClient = useQueryClient();

    const summaryMutation = useMutation<SummarizeResponse>({
        mutationFn: () => reviewsApi.summarizeReviews(productId),
    });

    const handleReviewAdded = () => {
        queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
        summaryMutation.mutate();
    };

    // Tanstack is replacing 'useEffect' hooks, adding retry mechanism when calling API's
    const reviewsQuery = useQuery<ReviewsResponse>({
        queryKey: ['reviews', productId], // used for caching data
        queryFn: () => reviewsApi.fetchReviews(productId),
    });

    if (reviewsQuery.isLoading) {
        return (
            <div className="flex flex-col gap-5">
                {[1, 2, 3].map((placeholder) => (
                    <ReviewSkeleton key={placeholder} />
                ))}
            </div>
        );
    }

    if (reviewsQuery.error) {
        return (
            <p className="text-red-500">
                Cannot render the reviews currently. Please, try again later!
            </p>
        );
    }

    if (!reviewsQuery.data) {
        return null;
    }

    const currentSummary =
        reviewsQuery.data.summary || summaryMutation.data?.summary;

    return (
        <div>
            <div className="mb-5">
                {currentSummary ? (
                    <p>{currentSummary}</p>
                ) : (
                    <div>
                        {Boolean(reviewsQuery.data?.reviews.length) && (
                            <Button
                                onClick={() => summaryMutation.mutate()}
                                className="cursor-pointer"
                                disabled={summaryMutation.isPending}
                            >
                                <HiSparkles />
                                Summarize
                            </Button>
                        )}
                        {summaryMutation.isPending && (
                            <div className="py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {summaryMutation.error && (
                            <p className="text-red-500">
                                Could not summarize reviews. Try again!
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="mb-5">
                <AddReviewDialog
                    productId={productId}
                    existingReviews={reviewsQuery.data?.reviews ?? []}
                    onReviewAdded={handleReviewAdded}
                />
            </div>
            <div className="flex flex-col gap-5">
                {reviewsQuery.data?.reviews.map((review) => (
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
