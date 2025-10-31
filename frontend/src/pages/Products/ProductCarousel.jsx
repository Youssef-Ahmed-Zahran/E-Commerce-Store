// src/components/ProductCarousel.jsx
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    appendDots: (dots) => (
      <div className="absolute bottom-4 left-0 right-0">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 bg-white/40 rounded-full hover:bg-emerald-400 transition-colors duration-300"></div>
    ),
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="relative">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product._id}>
                {/* Mobile Layout */}
                <div className="md:hidden relative">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden mx-2 shadow-lg">
                    {/* Image Section with white background */}
                    <div className="relative bg-white p-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-contain"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                      {/* Title and Price */}
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {product.name}
                        </h3>
                        <p className="text-3xl font-bold text-emerald-400">
                          ${product.price}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <FaStore className="text-sm" />
                            <span className="text-xs text-gray-400">Brand</span>
                          </div>
                          <p className="text-white font-semibold">
                            {product.brand}
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <FaClock className="text-sm" />
                            <span className="text-xs text-gray-400">Added</span>
                          </div>
                          <p className="text-white font-semibold text-sm">
                            {moment(product.createdAt).fromNow()}
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <FaStar className="text-sm" />
                            <span className="text-xs text-gray-400">
                              Rating
                            </span>
                          </div>
                          <p className="text-white font-semibold">
                            {product.rating.toFixed(1)} / 5
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <FaShoppingCart className="text-sm" />
                            <span className="text-xs text-gray-400">
                              Quantity
                            </span>
                          </div>
                          <p className="text-white font-semibold">
                            {product.quantity}
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <FaBox className="text-sm" />
                            <span className="text-xs text-gray-400">
                              In Stock
                            </span>
                          </div>
                          <p className="text-white font-semibold">
                            {product.countInStock}
                          </p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-400 mb-1">
                            <FaStar className="text-sm" />
                            <span className="text-xs text-gray-400">
                              Reviews
                            </span>
                          </div>
                          <p className="text-white font-semibold">
                            {product.numReviews}
                          </p>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link to={`/product/${product._id}`}>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden mx-4 shadow-xl">
                    <div className="grid grid-cols-2 gap-8 p-8">
                      {/* Left: Image with white background */}
                      <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-96 object-contain"
                        />
                      </div>

                      {/* Right: Content */}
                      <div className="flex flex-col justify-between">
                        {/* Title and Price */}
                        <div className="mb-6">
                          <h3 className="text-3xl font-bold text-white mb-3">
                            {product.name}
                          </h3>
                          <p className="text-4xl font-bold text-emerald-400">
                            ${product.price}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-4">
                          {product.description}
                        </p>

                        {/* Details Grid - More Compact */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                          <div className="bg-slate-700/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                              <FaStore className="text-sm" />
                              <span className="text-xs text-gray-400">
                                Brand
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">
                              {product.brand}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                              <FaClock className="text-sm" />
                              <span className="text-xs text-gray-400">
                                Added
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">
                              {moment(product.createdAt).fromNow()}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                              <FaStar className="text-sm" />
                              <span className="text-xs text-gray-400">
                                Rating
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">
                              {product.rating.toFixed(1)} / 5
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                              <FaShoppingCart className="text-sm" />
                              <span className="text-xs text-gray-400">
                                Quantity
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">
                              {product.quantity}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                              <FaBox className="text-sm" />
                              <span className="text-xs text-gray-400">
                                In Stock
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">
                              {product.countInStock}
                            </p>
                          </div>
                          <div className="bg-slate-700/50 rounded-lg p-2.5">
                            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                              <FaStar className="text-sm" />
                              <span className="text-xs text-gray-400">
                                Reviews
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">
                              {product.numReviews}
                            </p>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Link to={`/product/${product._id}`}>
                          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;
