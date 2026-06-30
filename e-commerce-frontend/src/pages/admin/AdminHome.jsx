import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hook/useAuth";
import { useDeleteCategory, useCategory, useCategories } from "../../hook/useCategory";
import { toast } from "sonner";


export  function AdminHome() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const deleteCategoryMutation = useDeleteCategory();
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const baseUrl = import.meta.env.VITE_API_IMAGE_URL;//for image display

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const currencyFormatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });
  
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <div className="flex flex-wrap gap-2">
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
        
        {/* CATEGORIES */}
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="grid gap-8">
            {categoriesData?.map((category) => (
              <div
                key={category.id}
                className="
                  bg-white
                  rounded-2xl
                  shadow-sm
                  border
                  border-slate-200
                  overflow-hidden
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
              >
                {/* Category Header */}
                <div className="flex items-start justify-between p-6 bg-slate-50">
                  <div>
                      <h2 className="text-2xl font-bold">
                          {category.name}
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                          {category.products.length} Products • {category.attributes.length} Attributes
                      </p>
                  </div>

                  {/* <button
                      onClick={() => navigate(`/edit-category/${category.id}`)}
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
                  >
                      Edit Category
                  </button> */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-category/${category.id}`)}
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setCategoryToDelete(category)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
              </div>

                {/* Products */}
                <div className="p-6">
                  {category.products?.length > 0 ? (
                    <div
                      className="
                          flex
                          gap-4
                          overflow-x-auto
                          snap-x
                          snap-mandatory
                          scrollbar-hide
                          scroll-smooth
                          pb-2
                      "
                      // className="
                      //   group
                      //   min-w-[200px]
                      //   max-w-[200px]
                      //   bg-white
                      //   rounded-xl
                      //   border
                      //   border-slate-200
                      //   overflow-hidden
                      //   transition-all
                      //   duration-300
                      //   hover:-translate-y-1
                      //   hover:shadow-xl
                      //   snap-start
                      //   "
                  >
                      {category.products.slice(0, 6).map((product) => (

                        <Link
                          to={`/edit-product/${product.id}`}
                          // href="#"
                          key={product.id}
                          className="
                            group
                            min-w-[200px]
                            max-w-[200px]
                            flex-shrink-0
                            bg-white
                            rounded-xl
                            border
                            border-slate-200
                            overflow-hidden
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                            hover:border-blue-180
                            snap-start
                          "
                        >
                          {/* Product Image */}
                          <img
                            src={`${baseUrl}${product.images?.[0]?.imgUrl}`}
                            alt={product.name}
                            className="
                              w-full
                              aspect-square
                              object-cover
                              transition-transform
                              duration-500
                              group-hover:scale-105
                            "
                          />

                          {/* Product Content */}
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-slate-900">
                              {product.name}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="mt-2 text-xs text-slate-500">
                                {product.images.length} Images
                            </div>

                            <div className="mt-3 flex justify-between items-center">
                              <span className="font-bold text-green-600">
                                {currencyFormatter.format(product.price)}
                              </span>

                              {/* <span
                                className="
                                  text-blue-600
                                  opacity-0
                                  group-hover:opacity-100
                                  transition
                                "
                              >
                                View →
                              </span> */}
                              <div className="mt-4">
                                  <div className="w-full rounded-lg bg-blue-600 px-2 py-2 text-center text-sm font-medium text-white group-hover:bg-blue-700">
                                      Edit
                                  </div>
                              </div>
                            </div>

                            {/* Attributes */}
                            {/* <div className="flex flex-wrap gap-2 mt-4">
                              {product.attributes?.map((attr, index) => (
                                <span
                                  key={index}
                                  className="
                                    px-2
                                    py-1
                                    bg-slate-100
                                    rounded-full
                                    text-xs
                                    text-slate-600
                                  "
                                >
                                  {attr.attributeName}: {attr.attributeValue}
                                </span>
                              ))}
                            </div> */}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">
                      No products available.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
        {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold text-slate-900">
                Delete Category
              </h2>
            </div>

            <div className="px-6 py-5">
              <p className="text-slate-600">
                Are you sure you want to delete
                <span className="font-semibold">
                  {" "}
                  "{categoryToDelete.name}"
                </span>
                ?
              </p>

              <p className="mt-3 text-sm text-red-600">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">

              <button
                onClick={() => setCategoryToDelete(null)}
                disabled={deleteCategoryMutation.isPending}
                className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteCategory}
                disabled={deleteCategoryMutation.isPending}
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteCategoryMutation.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}