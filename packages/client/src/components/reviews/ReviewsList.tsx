import { useState } from 'react';
import { StarRating } from './StarRating';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../components/ui/button';
import { HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';
import AddReviewDialog from './AddReviewDialog';
import ReviewContentDialog from './ReviewContentDialog';
import {
    reviewsApi,
    type ReviewsResponse,
    type SummarizeResponse,
} from './reviewsApi';

type Props = {
    productId: number;
};

const REVIEWS_PER_PAGE = 5;
const CONTENT_PREVIEW_LENGTH = 240;

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
    const [currentPage, setCurrentPage] = useState(1);
    const [pagedProductId, setPagedProductId] = useState(productId);

    // Switching products should always land back on page 1. Adjusting state
    // during render (rather than an effect) avoids an extra commit.
    if (productId !== pagedProductId) {
        setPagedProductId(productId);
        setCurrentPage(1);
    }

    const summaryMutation = useMutation<SummarizeResponse>({
        mutationFn: () => reviewsApi.summarizeReviews(productId),
    });

    const handleReviewAdded = () => {
        queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
        summaryMutation.mutate();
        setCurrentPage(1);
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

    const reviews = reviewsQuery.data.reviews;
    const totalPages = Math.max(
        1,
        Math.ceil(reviews.length / REVIEWS_PER_PAGE)
    );
    const pageStart = (currentPage - 1) * REVIEWS_PER_PAGE;
    const paginatedReviews = reviews.slice(
        pageStart,
        pageStart + REVIEWS_PER_PAGE
    );

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
                            <div className="rounded-3xl border border-white/10 bg-card/70 p-5 py-3 mt-4">
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
                {paginatedReviews.map((review, index) => {
                    const isContentTruncated =
                        review.content.length > CONTENT_PREVIEW_LENGTH;
                    const contentPreview = isContentTruncated
                        ? `${review.content.slice(0, CONTENT_PREVIEW_LENGTH)}…`
                        : review.content;

                    return (
                        <div
                            key={review.id}
                            className="rounded-2xl border border-white/[0.07] bg-card/40 p-5"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={`grid size-9 shrink-0 place-items-center rounded-full font-heading text-xs font-semibold ${getAvatarStyle(pageStart + index)}`}
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
                            <div className="mt-3 flex items-start gap-1 text-sm leading-relaxed text-muted-foreground">
                                <span className="min-w-0 flex-1 break-words">
                                    {contentPreview}
                                </span>
                                {isContentTruncated && (
                                    <ReviewContentDialog
                                        author={review.author}
                                        content={review.content}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon-sm"
                        className="cursor-pointer"
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        aria-label="Previous page"
                    >
                        <HiChevronLeft />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <Button
                                key={page}
                                variant={
                                    page === currentPage
                                        ? 'default'
                                        : 'outline'
                                }
                                size="icon-sm"
                                className="cursor-pointer"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        )
                    )}
                    <Button
                        variant="outline"
                        size="icon-sm"
                        className="cursor-pointer"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((page) =>
                                Math.min(totalPages, page + 1)
                            )
                        }
                        aria-label="Next page"
                    >
                        <HiChevronRight />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;
