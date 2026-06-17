import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { HiPlus } from 'react-icons/hi2';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/ui/dialog';
import { reviewsApi, type CreateReviewInput, type Review } from './reviewsApi';

type Props = {
    productId: number;
    existingReviews: Review[];
    onReviewAdded: () => void;
};

type FormErrors = {
    author?: string;
    rating?: string;
    content?: string;
};

const inputClassName =
    'w-full rounded-md border border-border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const AddReviewDialog = ({
    productId,
    existingReviews,
    onReviewAdded,
}: Props) => {
    const [open, setOpen] = useState(false);
    const [author, setAuthor] = useState('');
    const [rating, setRating] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const createReviewMutation = useMutation({
        mutationFn: (input: CreateReviewInput) =>
            reviewsApi.createReview(productId, input),
        onSuccess: () => {
            resetForm();
            setOpen(false);
            onReviewAdded();
        },
    });

    const resetForm = () => {
        setAuthor('');
        setRating('');
        setContent('');
        setErrors({});
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            resetForm();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedAuthor = author.trim();
        const trimmedContent = content.trim();
        const parsedRating = Number(rating);

        const newErrors: FormErrors = {};

        if (!trimmedAuthor) {
            newErrors.author = 'Client name cannot be empty.';
        } else if (
            existingReviews.some(
                (review) =>
                    review.author.trim().toLowerCase() ===
                    trimmedAuthor.toLowerCase()
            )
        ) {
            newErrors.author = 'A review from this author already exists.';
        }

        if (
            !rating.trim() ||
            !Number.isInteger(parsedRating) ||
            parsedRating < 0 ||
            parsedRating > 5
        ) {
            newErrors.rating = 'Stars must be a whole number from 0 to 5.';
        }

        if (!trimmedContent) {
            newErrors.content = 'Description cannot be empty.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        createReviewMutation.mutate({
            author: trimmedAuthor,
            rating: parsedRating,
            content: trimmedContent,
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <HiPlus />
                    Add review
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add review</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor="review-author"
                            className="mb-1 block text-sm font-medium"
                        >
                            Client name
                        </label>
                        <input
                            id="review-author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className={inputClassName}
                        />
                        {errors.author && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.author}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="review-rating"
                            className="mb-1 block text-sm font-medium"
                        >
                            Stars
                        </label>
                        <input
                            id="review-rating"
                            type="number"
                            step="1"
                            min="0"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className={inputClassName}
                        />
                        {errors.rating && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.rating}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="review-content"
                            className="mb-1 block text-sm font-medium"
                        >
                            Description
                        </label>
                        <textarea
                            id="review-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`${inputClassName} h-20 min-h-20 max-h-[120px] resize-y`}
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.content}
                            </p>
                        )}
                    </div>
                    {createReviewMutation.error && (
                        <p className="text-sm text-red-500">
                            Could not save the review. Try again!
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={createReviewMutation.isPending}
                    >
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddReviewDialog;
