import { useState } from 'react';
import ReviewsList from './components/reviews/ReviewsList';
import ProductsPage from './components/products/ProductsPage';
import { Button } from '../components/ui/button';

function App() {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null
    );

    return (
        <div className="p-4 h-screen w-full">
            {selectedProductId === null ? (
                <ProductsPage onSelectProduct={setSelectedProductId} />
            ) : (
                <div>
                    <Button
                        variant="ghost"
                        className="mb-5"
                        onClick={() => setSelectedProductId(null)}
                    >
                        &larr; Back to products
                    </Button>
                    <ReviewsList productId={selectedProductId} />
                </div>
            )}
        </div>
    );
}

export default App;
