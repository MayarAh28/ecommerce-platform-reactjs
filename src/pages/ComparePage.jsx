import { useState, useEffect } from "react";
import { getProducts } from "../features/products/services/productService";
import useCompareStore from "../features/products/hooks/useCompareStore";

export default function ComparePage() {
  const [products, setProducts] = useState([]);
  const selectedProductA = useCompareStore((s) => s.selectedProductA);
  const selectedProductB = useCompareStore((s) => s.selectedProductB);
  const setProductA = useCompareStore((s) => s.setProductA);
  const setProductB = useCompareStore((s) => s.setProductB);

  useEffect(() => {
    async function load() {
      const allProducts = await getProducts();
      setProducts(allProducts);
    }
    load();
  }, []);

  const comparisonFields = [
    { label: "Price", key: "price", format: (v) => `$${v?.toFixed(2) || "—"}` },
    { label: "Category", key: "category", format: (v) => v || "—" },
    { label: "Rating", key: "rating", format: (v) => (v ? `${v} / 5` : "—") },
    {
      label: "Stock",
      key: "stock",
      format: (v) => (v != null ? `${v} units` : "—"),
    },
  ];

  function comparePrice(priceA, priceB) {
    return priceA < priceB ? true : false;
  }
  function compareRating(rateA, rateB) {
    return rateA > rateB ? true : false;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
        <p className="text-gray-500 mt-1">
          Select two products to compare them side by side
        </p>
      </div>

      {/* Product Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product A
          </label>
          <select
            value={selectedProductA?.id || ""}
            onChange={(e) => {
              const foundProduct = products.find(
                (p) => p.id === Number(e.target.value)
              );
              if (foundProduct) {
                setProductA(foundProduct);
              }
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product B
          </label>
          <select
            value={selectedProductB?.id || ""}
            onChange={(e) => {
              const foundProduct = products.find(
                (p) => p.id === Number(e.target.value)
              );
              if (foundProduct) {
                setProductB(foundProduct);
              }
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">Select a product...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedProductA === selectedProductB &&
      selectedProductA !== undefined ? (
        <p className="text-gray-500 mt-1 text-center">
          Cannont compare the product with itself, Please choose a different
          product.
        </p>
      ) : selectedProductA || selectedProductB ? (
        <>
          {selectedProductA?.category !== selectedProductB?.category && (
            <p className="italic text-yellow-700">
              Note: You're comparing between two prodcuts from different
              categories!
            </p>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Product Headers */}
            <div className="grid grid-cols-3 border-b border-gray-100">
              <div className="p-4 bg-gray-50 font-medium text-sm text-gray-500">
                Feature
              </div>
              <div className="p-4 text-center border-l border-gray-100">
                {selectedProductA ? (
                  <div>
                    <img
                      src={selectedProductA.thumbnail}
                      alt={selectedProductA.title}
                      className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                    />
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {selectedProductA.title}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-8">Select Product A</p>
                )}
              </div>
              <div className="p-4 text-center border-l border-gray-100">
                {selectedProductB ? (
                  <div>
                    <img
                      src={selectedProductB.thumbnail}
                      alt={selectedProductB.title}
                      className="w-20 h-20 object-cover rounded-xl mx-auto mb-2"
                    />
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                      {selectedProductB.title}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-8">Select Product B</p>
                )}
              </div>
            </div>

            {/* Comparison Rows */}
            {comparisonFields.map((field) => (
              <div
                key={field.key}
                className="grid grid-cols-3 border-b border-gray-50 last:border-0"
              >
                <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
                  {field.label}
                </div>
                <div
                  className={`p-4 text-center text-sm  border-l border-gray-100 ${
                    field.label === "Price"
                      ? selectedProductA?.price === selectedProductB?.price
                        ? "text-gray-700"
                        : comparePrice(
                            selectedProductA?.price,
                            selectedProductB?.price
                          )
                        ? "text-green-700"
                        : "text-red-700"
                      : field.label === "Rating"
                      ? selectedProductA?.rating === selectedProductB?.rating
                        ? "text-gray-700"
                        : compareRating(
                            selectedProductA?.rating,
                            selectedProductB?.rating
                          )
                        ? "text-green-700"
                        : "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {selectedProductA
                    ? field.format(selectedProductA[field.key])
                    : "—"}
                </div>
                <div
                  className={`p-4 text-center text-sm  border-l border-gray-100 ${
                    field.label === "Price"
                      ? selectedProductA?.price === selectedProductB?.price
                        ? "text-gray-700"
                        : comparePrice(
                            selectedProductB?.price,
                            selectedProductA?.price
                          )
                        ? "text-green-700"
                        : "text-red-700"
                      : field.label === "Rating"
                      ? selectedProductA?.rating === selectedProductB?.rating
                        ? "text-gray-700"
                        : compareRating(
                            selectedProductB?.rating,
                            selectedProductA?.rating
                          )
                        ? "text-green-700"
                        : "text-red-700"
                      : "text-gray-700"
                  }`}
                >
                  {selectedProductB
                    ? field.format(selectedProductB[field.key])
                    : "—"}
                </div>
              </div>
            ))}

            {/* Description */}
            <div className="grid grid-cols-3 border-t border-gray-100">
              <div className="p-4 bg-gray-50 text-sm font-medium text-gray-600">
                Description
              </div>
              <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
                {selectedProductA?.description || "—"}
              </div>
              <div className="p-4 text-sm text-gray-600 border-l border-gray-100 leading-relaxed">
                {selectedProductB?.description || "—"}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <svg
            className="w-20 h-20 text-gray-200 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Select Products to Compare
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Choose two products from the dropdowns above to see a detailed
            side-by-side comparison.
          </p>
        </div>
      )}
    </div>
  );
}
