import { useQuery } from '@tanstack/react-query';
import { productsApi, type Product } from './productsApi';
import ProductsTable from './ProductsTable';
import ProductsSkeleton from './ProductsSkeleton';
import AddProductDialog from './AddProductDialog';

type Props = {
    onSelectProduct: (productId: number) => void;
};

const ProductsPage = ({ onSelectProduct }: Props) => {
    const productsQuery = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => productsApi.fetchProducts(),
    });

    return (
        <div>
            <div className="mb-7 flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pick a product to read its reviews and AI summary.
                    </p>
                </div>
                <AddProductDialog existingProducts={productsQuery.data ?? []} />
            </div>
            {productsQuery.isLoading && <ProductsSkeleton />}
            {productsQuery.error && (
                <p className="rounded-2xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
                    Cannot render the products currently. Please, try again
                    later!
                </p>
            )}
            {productsQuery.data && (
                <ProductsTable
                    products={productsQuery.data}
                    onSelectProduct={onSelectProduct}
                />
            )}
        </div>
    );
};

export default ProductsPage;
