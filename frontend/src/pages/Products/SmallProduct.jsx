// src/components/Products/SmallProduct.jsx
import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="group relative bg-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-emerald-400">
            ${product.price}
          </span>
          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
