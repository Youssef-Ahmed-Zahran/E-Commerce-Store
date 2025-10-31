// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let filtered = filteredProductsQuery.data;

      if (selectedBrand) {
        filtered = filtered.filter(
          (product) => product.brand === selectedBrand
        );
      }

      dispatch(setProducts(filtered));
    }
  }, [
    filteredProductsQuery.data,
    filteredProductsQuery.isLoading,
    selectedBrand,
    dispatch,
  ]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(selectedBrand === brand ? "" : brand);
  };

  const handlePriceFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;

    if (max < min) {
      alert("Maximum price cannot be less than minimum price");
      return;
    }

    dispatch(setRadio([min, max]));
  };

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    dispatch(setRadio([]));
  };

  const handleReset = () => {
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrand("");
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
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
        {/* Filters Sidebar – NARROWED */}
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
                  onClick={() => setSelectedBrand("")}
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

        {/* Products Grid – MORE SPACE */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5">
            <h2 className="text-2xl font-bold text-white">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {products?.length || 0} Product
                  {products?.length !== 1 ? "s" : ""}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {products?.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
