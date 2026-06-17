import { useState } from 'react';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi2';
import ReviewsList from './components/reviews/ReviewsList';
import ProductsPage from './components/products/ProductsPage';
import { Button } from '../components/ui/button';

function App() {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null
    );

    return (
        <div className="min-h-screen w-full px-6 py-8 md:px-10 md:py-10">
            <div className="mx-auto flex max-w-5xl flex-col">
                <header className="mb-10 flex items-center justify-between border-b border-white/[0.06] pb-6">
                    <div className="flex items-center gap-2.5">
                        <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-red text-white shadow-[0_8px_20px_-6px_rgba(139,92,246,0.6)]">
                            <HiSparkles className="size-4.5" />
                        </span>
                        <h1 className="font-heading text-lg font-semibold tracking-tight">
                            Review<span className="text-accent-purple">Summarizer</span>
                        </h1>
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex">
                        <HiSparkles className="size-3.5 text-accent-yellow" />
                        AI-powered insights
                    </span>
                </header>

                {selectedProductId === null ? (
                    <ProductsPage onSelectProduct={setSelectedProductId} />
                ) : (
                    <div>
                        <Button
                            variant="ghost"
                            className="mb-6 -ml-2"
                            onClick={() => setSelectedProductId(null)}
                        >
                            <HiArrowLeft />
                            Back to products
                        </Button>
                        <ReviewsList productId={selectedProductId} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
