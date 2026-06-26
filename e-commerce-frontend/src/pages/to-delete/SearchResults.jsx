import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "./ProductCard";
import { productsAPI } from "../../api/productsApi";

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  console.log(query)

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productsAPI.getProducts,
  });

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();

    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.categoryName?.toLowerCase().includes(searchTerm)
      );
    });
  }, [products, query]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load products
          </h2>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results
            </h1>

            <p className="text-gray-600 mt-2">
              Search term:
              <span className="font-semibold text-blue-600 ml-2">
                "{query}"
              </span>
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold text-blue-600">
              {searchResults.length}
            </div>

            <p className="text-gray-500 text-sm">
              Product{searchResults.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Results */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() =>
                  navigate(`/product/${product.id}`)
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaSearch className="mx-auto text-5xl text-gray-300 mb-4" />

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>

            <p className="text-gray-600 mb-6">
              We couldn't find any products matching
              <span className="font-semibold"> "{query}"</span>.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}