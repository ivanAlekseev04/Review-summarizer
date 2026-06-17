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
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Products</h1>
                <AddProductDialog existingProducts={productsQuery.data ?? []} />
            </div>
            {productsQuery.isLoading && <ProductsSkeleton />}
            {productsQuery.error && (
                <p className="text-red-500">
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
