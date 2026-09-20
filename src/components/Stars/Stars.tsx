import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

type TProps = {
  rating: number;
};

const Stars = ({ rating }: TProps) => {
  const generateStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span className="text-error-6" key={`full-${i}`}>
          <FaStar size={14} />
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span className="text-error-6" key={`half-${fullStars}`}>
          <FaStarHalfAlt size={14} />
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span className="text-neutral-6" key={`empty-${fullStars + i + (hasHalfStar ? 1 : 0)}`}>
          <FaRegStar size={14} />
        </span>
      );
    }

    return stars;
  };

  return <div className="flex items-center space-x-1">{generateStars()}</div>;
};

export default Stars;

