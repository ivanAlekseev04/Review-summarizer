import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HiPlus } from 'react-icons/hi2';
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/ui/dialog';
import { productsApi, type Product } from './productsApi';

type Props = {
    existingProducts: Product[];
};

type FormErrors = {
    name?: string;
    description?: string;
    price?: string;
};

const inputClassName =
    'w-full rounded-md border border-border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

const AddProductDialog = ({ existingProducts }: Props) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const queryClient = useQueryClient();

    const createProductMutation = useMutation({
        mutationFn: productsApi.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            resetForm();
            setOpen(false);
        },
    });

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
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

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        const parsedPrice = Number(price);

        const newErrors: FormErrors = {};

        if (!trimmedName) {
            newErrors.name = 'Name cannot be empty.';
        } else if (
            existingProducts.some(
                (product) =>
                    product.name.trim().toLowerCase() ===
                    trimmedName.toLowerCase()
            )
        ) {
            newErrors.name = 'A product with this name already exists.';
        }

        if (!trimmedDescription) {
            newErrors.description = 'Description cannot be empty.';
        }

        if (!price.trim() || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
            newErrors.price = 'Price must be greater than 0.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        createProductMutation.mutate({
            name: trimmedName,
            description: trimmedDescription,
            price: parsedPrice,
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <HiPlus />
                    Add product
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor="product-name"
                            className="mb-1 block text-sm font-medium"
                        >
                            Name
                        </label>
                        <input
                            id="product-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClassName}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="product-description"
                            className="mb-1 block text-sm font-medium"
                        >
                            Description
                        </label>
                        <textarea
                            id="product-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${inputClassName} h-20 min-h-20 max-h-[120px] resize-y`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="product-price"
                            className="mb-1 block text-sm font-medium"
                        >
                            Price
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={inputClassName}
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.price}
                            </p>
                        )}
                    </div>
                    {createProductMutation.error && (
                        <p className="text-sm text-red-500">
                            Could not save the product. Try again!
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={createProductMutation.isPending}
                    >
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductDialog;
