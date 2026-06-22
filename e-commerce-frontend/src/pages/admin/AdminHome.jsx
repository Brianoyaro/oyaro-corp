import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";

export  function AdminHome() {
  const [categories, setCategories] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (id) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/create-category")}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Category
            </button>

            <button
              onClick={() => navigate("/create-product")}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Product
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-xl shadow">
            No categories found
          </div>
        ) : (
          <div className="space-y-6">

            {categories.map((category) => {
              const isOpen = openCategoryId === category.id;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow border overflow-hidden"
                >

                  {/* CATEGORY HEADER */}
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        {category.name}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {category.description}
                      </p>
                    </div>

                    <div className="text-sm text-slate-600">
                      {category.products?.length || 0} products
                    </div>
                  </div>

                  {/* ATTRIBUTES */}
                  <div className="px-5 pb-4 flex flex-wrap gap-2">
                    {category.attributes?.map((attr) => (
                      <span
                        key={attr.id}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                      >
                        {attr.name}
                      </span>
                    ))}
                  </div>

                  {/* PRODUCTS (COLLAPSIBLE) */}
                  {isOpen && (
                    <div className="p-5 border-t bg-slate-50">
                      {category.products?.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No products in this category
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

                          {category.products.map((product) => {
                            const primaryImage =
                              product.images?.find(
                                (img) => img.isPrimary
                              ) || product.images?.[0];

                            return (
                              <div
                                key={product.id}
                                onClick={() =>
                                  navigate(`/product/${product.id}`)
                                }
                                className="bg-white border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition"
                              >
                                {/* IMAGE */}
                                <div className="h-28 bg-gray-100">
                                  {primaryImage ? (
                                    <img
                                      src={`http://localhost:8080${primaryImage.imgUrl}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                      No Image
                                    </div>
                                  )}
                                </div>

                                {/* INFO */}
                                <div className="p-2">
                                  <h3 className="text-sm font-semibold line-clamp-1">
                                    {product.name}
                                  </h3>

                                  <p className="text-xs text-gray-500 line-clamp-1">
                                    {product.description}
                                  </p>

                                  <p className="text-sm font-bold text-green-600 mt-1">
                                    {formatPrice(product.price)}
                                  </p>

                                  {/* ATTRIBUTES */}
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {product.attributes?.map(
                                      (attr, idx) => (
                                        <span
                                          key={idx}
                                          className="text-[10px] bg-slate-100 px-2 py-0.5 rounded"
                                        >
                                          {attr.attributeName}: {attr.attributeValue}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}