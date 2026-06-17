import ReviewsList from './components/reviews/ReviewsList';

function App() {
    return (
        <div className="p-4 h-screen w-full">
            <ReviewsList productId={1} />
        </div>
    );
}

export default App;
