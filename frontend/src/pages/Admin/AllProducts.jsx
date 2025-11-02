import { Link, useSearchParams } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useAllProductsQuery({
    page: currentPage,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-500 font-medium">
          Failed to load products
        </p>
      </div>
    );
  }

  const { products = [], page, pages } = data || {};

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }

      if (currentPage < pages - 2) {
        pageNumbers.push("...");
      }

      // Always show last page
      if (!pageNumbers.includes(pages)) {
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              All Products
            </h1>
            <div className="bg-slate-700 px-4 py-2 rounded-full text-sm font-medium text-gray-300">
              Page {page} of {pages}
            </div>
          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-12 text-center shadow-lg">
              <p className="text-lg text-gray-400">No products available.</p>
            </div>
          ) : (
            <>
              {/* Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/admin/updateproduct/${product._id}`}
                    className="group block"
                  >
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700">
                      {/* Image */}
                      <div className="aspect-w-16 aspect-h-9 h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {moment(product.createdAt).format("MMM D, YYYY")}
                        </p>

                        <p className="text-sm text-gray-300 line-clamp-2">
                          {product.description?.substring(0, 120)}...
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                          <span className="text-xl font-bold text-cyan-400">
                            ${product.price}
                          </span>

                          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 group-hover:text-cyan-300 transition-colors">
                            Edit
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-600 transition-all duration-200 hover:shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {renderPageNumbers().map((pageNum, index) =>
                      pageNum === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 text-gray-500 font-bold"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[40px] h-10 rounded-lg font-semibold transition-all duration-200 ${
                            currentPage === pageNum
                              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 scale-105"
                              : "bg-slate-700 text-gray-300 hover:bg-slate-600 hover:shadow-md"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pages}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-600 transition-all duration-200 hover:shadow-lg"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
