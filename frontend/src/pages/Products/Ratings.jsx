// src/components/Products/Ratings.jsx
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Ratings = ({ value, text, color = "yellow-400" }) => {
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className={`text-${color} text-lg`} />
      ))}
      {halfStar === 1 && <FaStarHalfAlt className={`text-${color} text-lg`} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className={`text-${color} text-lg`} />
      ))}

      {text && <span className={`ml-2 text-sm text-gray-400`}>{text}</span>}
    </div>
  );
};

Ratings.defaultProps = {
  color: "yellow-400",
};

export default Ratings;
