import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";
import Product from "../pages/Products/Product.jsx";

const Home = () => {
  const { keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prevKeyword, setPrevKeyword] = useState(keyword);

  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useGetProductsQuery({
    keyword,
    page: currentPage,
  });

  // Only reset to page 1 when keyword actually changes (not on mount)
  useEffect(() => {
    if (keyword !== prevKeyword) {
      setSearchParams({ page: "1" });
      setPrevKeyword(keyword);
    }
  }, [keyword, prevKeyword, setSearchParams]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    if (!data?.pages) return [];

    const pageNumbers = [];
    const maxVisible = 5;
    const { pages } = data;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

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

      if (!pageNumbers.includes(pages)) {
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <>
      {!keyword && <Header />}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <section className="container mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>

          {data?.products?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {data?.products?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data?.pages > 1 && (
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
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 scale-105"
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
                    disabled={currentPage === data?.pages}
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
        </section>
      )}
    </>
  );
};

export default Home;
