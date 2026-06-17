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
                    className={p <= value ? 'text-yellow-400' : 'text-gray-300'}
                />
            ))}
        </div>
    );
};
