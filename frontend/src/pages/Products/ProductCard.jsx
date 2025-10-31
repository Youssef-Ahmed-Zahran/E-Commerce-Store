// src/components/Products/ProductCard.jsx
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success("Added to cart");
  };

  return (
    <div className="group relative bg-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full max-w-sm mx-auto">
      {/* ---------- IMAGE (same as photo) ---------- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        <Link to={`/product/${p._id}`} className="block w-full h-full">
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
          {/* Brand Badge */}
          <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {p.brand}
          </div>
        </Link>

        {/* Heart Icon */}
        <div className="absolute top-1 right-1">
          <HeartIcon product={p} />
        </div>
      </div>

      {/* ---------- CONTENT (same as photo) ---------- */}
      <div className="p-6 space-y-4 bg-slate-800">
        <div className="flex justify-between items-start gap-1">
          <h3 className="flex-1 text-xl font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {p.name}
          </h3>
          <p className="text-xl font-bold text-emerald-400">
            ${p.price.toFixed(2)}
          </p>
        </div>

        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
          {p.description?.substring(0, 100)}...
        </p>

        {/* ---------- BUTTONS (same as photo) ---------- */}
        <div className="flex gap-3 pt-2">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition-all shadow-md"
          >
            View Details
          </Link>

          <button
            onClick={addToCartHandler}
            className="p-3 bg-slate-700 rounded-xl hover:bg-emerald-600 transition-all shadow-md"
            aria-label="Add to cart"
          >
            <AiOutlineShoppingCart className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
