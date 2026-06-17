import Skeleton from 'react-loading-skeleton';

const ProductsSkeleton = () => {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((placeholder) => (
                <Skeleton key={placeholder} height={32} />
            ))}
        </div>
    );
};

export default ProductsSkeleton;
