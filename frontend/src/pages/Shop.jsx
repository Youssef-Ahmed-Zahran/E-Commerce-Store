// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setPaginationData,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { categories, products, pages, hasMore } = useSelector(
    (state) => state.shop
  );

  // Get all params from URL
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const urlCategories = searchParams.get("categories");
  const urlMinPrice = searchParams.get("minPrice");
  const urlMaxPrice = searchParams.get("maxPrice");
  const urlBrand = searchParams.get("brand");

  // Initialize filters from URL
  const [checked, setCheckedState] = useState(
    urlCategories ? urlCategories.split(",") : []
  );
  const [radio, setRadioState] = useState(
    urlMinPrice && urlMaxPrice
      ? [parseFloat(urlMinPrice), parseFloat(urlMaxPrice)]
      : []
  );
  const [selectedBrand, setSelectedBrandState] = useState(urlBrand || "");
  const [minPrice, setMinPrice] = useState(urlMinPrice || "");
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice || "");

  const categoriesQuery = useFetchCategoriesQuery();

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
    page: currentPage,
  });

  // Sync Redux with local state
  useEffect(() => {
    dispatch(setChecked(checked));
    dispatch(setRadio(radio));
  }, [checked, radio, dispatch]);

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const {
        products: fetchedProducts,
        page,
        pages,
        hasMore,
      } = filteredProductsQuery.data;

      let filtered = fetchedProducts;

      if (selectedBrand) {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      dispatch(setProducts(filtered));
      dispatch(setPaginationData({ page, pages, hasMore }));
    }
  }, [
    filteredProductsQuery.data,
    filteredProductsQuery.isLoading,
    selectedBrand,
    dispatch,
  ]);

  // Update URL when filters or page change
  const updateURL = (newPage, newChecked, newRadio, newBrand) => {
    const params = new URLSearchParams();

    params.set("page", newPage.toString());

    if (newChecked.length > 0) {
      params.set("categories", newChecked.join(","));
    }

    if (newRadio.length > 0) {
      params.set("minPrice", newRadio[0].toString());
      params.set("maxPrice", newRadio[1].toString());
    }

    if (newBrand) {
      params.set("brand", newBrand);
    }

    setSearchParams(params);
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    setCheckedState(updatedChecked);
    updateURL(1, updatedChecked, radio, selectedBrand);
  };

  const handleBrandClick = (brand) => {
    const newBrand = selectedBrand === brand ? "" : brand;
    setSelectedBrandState(newBrand);
    updateURL(1, checked, radio, newBrand);
  };

  const handlePriceFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    if (max < min) {
      alert("Maximum price cannot be less than minimum price");
      return;
    }

    const newRadio = [min, max];
    setRadioState(newRadio);
    updateURL(1, checked, newRadio, selectedBrand);
  };

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setRadioState([]);
    updateURL(1, checked, [], selectedBrand);
  };

  const handleReset = () => {
    setCheckedState([]);
    setRadioState([]);
    setSelectedBrandState("");
    setMinPrice("");
    setMaxPrice("");
    updateURL(1, [], [], "");
  };

  const handlePageChange = (newPage) => {
    updateURL(newPage, checked, radio, selectedBrand);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data?.products
        ?.map((product) => product.brand)
        .filter((brand) => brand && brand.trim() !== "")
    ),
  ];

  const isLoading =
    categoriesQuery.isLoading || filteredProductsQuery.isLoading;
  const hasActiveFilters =
    checked.length > 0 || radio.length > 0 || selectedBrand;

  return (
    <div className="container mx-auto max-w-8xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="bg-slate-800 rounded-2xl p-5 lg:w-64 lg:sticky lg:top-6 lg:h-fit shadow-xl">
          {/* Category Filter */}
          <div className="mb-7">
            <h2 className="text-lg font-bold text-center py-2.5 bg-slate-900 rounded-xl mb-4 text-white">
              Categories
            </h2>
            <div className="max-h-56 overflow-y-auto space-y-2.5">
              {categoriesQuery.isLoading ? (
                <p className="text-center text-gray-400 text-sm">Loading...</p>
              ) : categories?.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">
                  No categories
                </p>
              ) : (
                categories?.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(c._id)}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-200 group-hover:text-emerald-400 transition-colors">
                      {c.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-7">
            <h2 className="text-lg font-bold text-center py-2.5 bg-slate-900 rounded-xl mb-4 text-white">
              Brands
            </h2>
            <div className="max-h-56 overflow-y-auto space-y-2.5">
              {uniqueBrands?.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">No brands</p>
              ) : (
                uniqueBrands?.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand}
                      onChange={() => handleBrandClick(brand)}
                      className="w-5 h-4 text-emerald-500 bg-slate-700 border-slate-600 focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-200 group-hover:text-emerald-400 transition-colors">
                      {brand}
                    </span>
                  </label>
                ))
              )}
              {selectedBrand && (
                <button
                  onClick={() => {
                    setSelectedBrandState("");
                    updateURL(currentPage, checked, radio, "");
                  }}
                  className="block w-full text-center text-xs text-emerald-400 hover:text-emerald-300 mt-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-7">
            <h2 className="text-lg font-bold text-center py-2.5 bg-slate-900 rounded-xl mb-4 text-white">
              Price Range
            </h2>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                className="w-full px-3 py-2.5 bg-slate-700 text-white placeholder-gray-400 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                className="w-full px-3 py-2.5 bg-slate-700 text-white placeholder-gray-400 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handlePriceFilter}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
                >
                  Apply
                </button>
                {radio.length > 0 && (
                  <button
                    onClick={clearPriceFilter}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
              {radio.length > 0 && (
                <p className="text-center text-xs text-gray-300 mt-1">
                  ${radio[0]} - ${radio[1] === Infinity ? "∞" : radio[1]}
                </p>
              )}
            </div>
          </div>

          {/* Reset All */}
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`w-full py-2.5 rounded-lg font-medium transition-all text-sm ${
              hasActiveFilters
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            Reset Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
            <h2 className="text-2xl font-bold text-white">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {products?.length || 0} Product
                  {products?.length !== 1 ? "s" : ""}
                  {pages > 1 && (
                    <span className="text-gray-400 text-lg ml-2">
                      (Page {currentPage} of {pages})
                    </span>
                  )}
                </>
              )}
            </h2>
            {hasActiveFilters && (
              <p className="text-sm text-gray-400 mt-1 sm:mt-0">
                {checked.length > 0 && `${checked.length} cat, `}
                {radio.length > 0 && "price, "}
                {selectedBrand && "1 brand"}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-96">
              <Loader />
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 mb-3">No products found</p>
              <p className="text-sm text-gray-500 mb-5">
                Try adjusting your filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === 1
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {[...Array(pages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === pages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              currentPage === pageNum
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-700 hover:bg-slate-600 text-white"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="w-10 h-10 flex items-center justify-center text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasMore}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !hasMore
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
