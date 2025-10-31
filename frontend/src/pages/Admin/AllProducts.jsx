import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

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
              {products.length} {products.length === 1 ? "item" : "items"}
            </div>
          </div>

          {/* Empty State */}
          {products.length === 0 ? (
            <div className="bg-slate-800 rounded-2xl p-12 text-center shadow-lg">
              <p className="text-lg text-gray-400">No products available.</p>
            </div>
          ) : (
            /* Product Cards */
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
