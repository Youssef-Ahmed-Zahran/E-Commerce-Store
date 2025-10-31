// src/components/Header.jsx
import { Link } from "react-router-dom";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  return (
    <header className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Discover <span className="text-emerald-400">Top</span> Products
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          High quality, competitive prices, and unforgettable shopping
          experience
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/shop"
            className="px-8 py-4 bg-emerald-500 text-white font-semibold text-lg rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105 shadow-xl"
          >
            Shop Now
          </Link>
          <Link
            to="/favorite"
            className="px-8 py-4 bg-transparent border-2 border-emerald-500 text-emerald-400 font-semibold text-lg rounded-full hover:bg-emerald-500 hover:text-white transition-all"
          >
            Favorites
          </Link>
        </div>
      </div>

      <div className="mt-16 w-full max-w-6xl mx-auto px-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
          <ProductCarousel />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
