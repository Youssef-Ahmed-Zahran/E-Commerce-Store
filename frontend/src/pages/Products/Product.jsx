import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="group w-full max-w-sm mx-auto">
      <Link to={`/product/${product._id}`} className="block">
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute top-3 right-3"
              onClick={(e) => e.preventDefault()}
            >
              <HeartIcon product={product} />
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {product.name}
              </h3>
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full border border-emerald-500/50">
                ${product.price}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Product;
