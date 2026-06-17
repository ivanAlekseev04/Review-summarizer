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

const AVATAR_PALETTE = [
    'bg-accent-purple/15 text-accent-purple',
    'bg-accent-red/15 text-accent-red',
    'bg-accent-yellow/15 text-accent-yellow',
];

const getAvatarStyle = (index: number) =>
    AVATAR_PALETTE[index % AVATAR_PALETTE.length];

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

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
            <p className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
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
            <div className="mb-7">
                {currentSummary ? (
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/70 p-5">
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-purple via-accent-red to-accent-yellow" />
                        <div className="mb-2 flex items-center gap-2 font-heading text-sm font-semibold tracking-tight text-accent-purple">
                            <HiSparkles className="size-4 text-accent-yellow" />
                            AI Summary
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">
                            {currentSummary}
                        </p>
                    </div>
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
                            <div className="rounded-3xl border border-white/10 bg-card/70 p-5 py-3">
                                <ReviewSkeleton />
                            </div>
                        )}
                        {summaryMutation.error && (
                            <p className="mt-3 rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
                                Could not summarize reviews. Try again!
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="mb-7">
                <AddReviewDialog
                    productId={productId}
                    existingReviews={reviewsQuery.data?.reviews ?? []}
                    onReviewAdded={handleReviewAdded}
                />
            </div>
            <div className="flex flex-col gap-4">
                {reviewsQuery.data?.reviews.map((review, index) => (
                    <div
                        key={review.id}
                        className="rounded-2xl border border-white/[0.07] bg-card/40 p-5"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`grid size-9 shrink-0 place-items-center rounded-full font-heading text-xs font-semibold ${getAvatarStyle(index)}`}
                            >
                                {getInitials(review.author)}
                            </span>
                            <div>
                                <div className="font-semibold text-foreground">
                                    {review.author}
                                </div>
                                <StarRating value={review.rating} />
                            </div>
                        </div>
                        <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {review.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsList;
