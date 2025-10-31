import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "../Products/HeartIcon";
import Ratings from "../Products/Ratings";
import ProductReviewTabs from "../Products/ProductReviewTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center text-emerald-400 hover:underline mb-8 ml-5"
        >
          Go Back
        </Link>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Image with white background - matching carousel style */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-contain"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {product.name}
                </h1>

                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} review${
                    product.numReviews !== 1 ? "s" : ""
                  }`}
                />

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-emerald-400">
                    ${product.price}
                  </span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.brand}
                  </span>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaStore className="text-emerald-400" />
                    <span className="text-gray-400">Brand:</span>
                    <span className="text-white">{product.brand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-emerald-400" />
                    <span className="text-gray-400">Added:</span>
                    <span className="text-white">
                      {moment(product.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-emerald-400" />
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBox className="text-emerald-400" />
                    <span className="text-gray-400">In Stock:</span>
                    <span className="text-white">{product.countInStock}</span>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="px-4 py-3 bg-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50"
                  >
                    {product.countInStock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews & Related */}
            <div className="mt-16">
              <ProductReviewTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductDetails;
