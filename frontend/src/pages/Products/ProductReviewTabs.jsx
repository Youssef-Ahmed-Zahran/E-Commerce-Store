// src/pages/Products/ProductReviewTabs.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductReviewTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data: topProducts, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tab Navigation */}
        <div className="lg:w-64">
          <div className="bg-slate-800 rounded-2xl p-2 shadow-xl">
            {[
              { id: 1, label: "Write Your Review" },
              { id: 2, label: "All Reviews" },
              { id: 3, label: "Related Products" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {/* === TAB 1: Write Review === */}
          {activeTab === 1 && (
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Write Your Review
              </h2>

              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-5">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Inferior</option>
                      <option value="2">2 - Decent</option>
                      <option value="3">3 - Great</option>
                      <option value="4">4 - Excellent</option>
                      <option value="5">5 - Exceptional</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Comment
                    </label>
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    {loadingProductReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-300 mb-4">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      sign in
                    </Link>{" "}
                    to write a review
                  </p>
                </div>
              )}
            </div>
          )}

          {/* === TAB 2: All Reviews === */}
          {activeTab === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-6">
                All Reviews ({product.reviews?.length || 0})
              </h2>

              {!product.reviews || product.reviews.length === 0 ? (
                <div className="bg-slate-800 rounded-xl p-8 text-center">
                  <p className="text-gray-400">No reviews yet.</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-slate-800 rounded-xl p-5 shadow-md border border-slate-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-white">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Ratings value={review.rating} />
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* === TAB 3: Related Products === */}
          {activeTab === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                Related Products
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader />
                </div>
              ) : !topProducts || topProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-10">
                  No related products found.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {topProducts.map((p) => (
                    <SmallProduct key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviewTabs;
