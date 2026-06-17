import { useQuery } from '@tanstack/react-query';
import { productsApi, type Product } from './productsApi';
import ProductsTable from './ProductsTable';
import ProductsSkeleton from './ProductsSkeleton';

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
            <h1 className="mb-5 text-2xl font-semibold">Products</h1>
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
