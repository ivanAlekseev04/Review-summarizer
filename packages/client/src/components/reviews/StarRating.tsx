import { FaStar } from 'react-icons/fa';

type Props = {
    value: number; // rating from 0 to 5
};

export const StarRating = ({ value }: Props) => {
    const placeholders = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {placeholders.map((p) => (
                <FaStar
                    key={p}
                    className={
                        p <= value
                            ? 'text-accent-yellow drop-shadow-[0_0_6px_rgba(255,210,63,0.45)]'
                            : 'text-white/10'
                    }
                />
            ))}
        </div>
    );
};
