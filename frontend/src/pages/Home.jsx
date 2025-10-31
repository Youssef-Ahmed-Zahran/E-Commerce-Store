import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice.js";
import Loader from "../components/Loader.jsx";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";
import Product from "../pages/Products/Product.jsx";

const Home = () => {
  const { keyword } = useParams();
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  const { data, isLoading, isError, isFetching } = useGetProductsQuery({
    keyword,
    page,
  });

  // Debug: Log data to see what's coming
  useEffect(() => {
    console.log("Data received:", data);
    console.log("Current page:", page);
    console.log("All products:", allProducts);
  }, [data, page, allProducts]);

  // Update products when data changes
  useEffect(() => {
    if (data?.products && Array.isArray(data.products)) {
      if (page === 1) {
        // On page 1, replace all products
        setAllProducts(data.products);
      } else {
        // On subsequent pages, append new products avoiding duplicates
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const newProducts = data.products.filter(
            (p) => !existingIds.has(p._id)
          );
          return [...prev, ...newProducts];
        });
      }
    }
  }, [data, page]);

  // Reset when keyword changes
  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <>
      {!keyword && <Header />}

      {isLoading && allProducts.length === 0 ? (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {allProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {data?.hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={isFetching}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white font-bold text-lg rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isFetching ? "Loading..." : "Load More Products"}
              </button>
            </div>
          )}

          {allProducts.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No products found.</p>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default Home;
