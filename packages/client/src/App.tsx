import ReviewsList from './components/reviews/ReviewsList';

function App() {
    return (
        <div className="p-4 h-screen w-full">
            <ReviewsList productId={4} />
        </div>
    );
}

export default App;
