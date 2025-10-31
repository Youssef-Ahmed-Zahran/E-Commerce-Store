import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const count = favorites.length;

  return (
    <div className="absolute -top-1 -right-1">
      {count > 0 && (
        <span className="px-2 py-1 text-xs font-bold text-white bg-emerald-500 rounded-full shadow-lg">
          {count}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
