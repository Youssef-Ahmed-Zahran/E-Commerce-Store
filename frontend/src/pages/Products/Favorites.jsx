import { useSelector } from "react-redux";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Title – Same as Shop & Admin pages */}
      <h1 className="text-2xl font-bold text-white mb-6">FAVORITE PRODUCTS</h1>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-400 mb-4">
            You haven't added any favorite products yet.
          </p>
          <p className="text-sm text-gray-500">
            Browse the shop and click the heart icon to add!
          </p>
        </div>
      ) : (
        /* Product Grid – Same as Shop (1–5 columns) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
