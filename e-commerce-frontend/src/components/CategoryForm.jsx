import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus, FiTrash2, FiTag } from "react-icons/fi";
import { z } from "zod";
import { useEffect } from "react";

import { useCreateCategory, useUpdateCategory, useCategory } from "../hook/useCategory";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const categorySchema = z.object({
  categoryName: z
    .string()
    .min(2, "Category name must be at least 2 characters"),

  categoryDescription: z
    .string()
    .min(5, "Description must be at least 5 characters"),

  attributes: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Attribute name is required"),
      })
    )
    .min(1, "At least one attribute is required"),
});


export default function CategoryForm({
  mode = "create", // "create" or "edit"
  categoryId = null, // Only needed for edit mode
}) {

    const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
      categoryDescription: "",
      attributes: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  // const { mutate } = useCreateCategory();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const navigate = useNavigate()

  let categoryData = null;
  let isLoading = false;
  if (mode === "edit") {
    const { data, isLoading: loading } = useCategory(categoryId);
    categoryData = data;
    isLoading = loading;
  }
  // console.log("Category Data:", categoryData);
  // console.log("Is Loading:", isLoading);
  // console.log("Mode:", mode);
  // console.log("Category ID:", categoryId);


  useEffect(() => {
    if (
      mode === "edit" &&
      categoryData
    ) {
      reset({
        categoryName:
          categoryData.name,
        categoryDescription:
          categoryData.description,

        attributes:
          categoryData.attributes.map(
            (attr) => ({
              name: attr.name,
            })
          ),
      });
    }
  }, [categoryData, mode, reset]);



  const onSubmit = async (
    data
  ) => {
    const payload = {
      category: {
        categoryName: data.categoryName,
        categoryDescription:
          data.categoryDescription,
      },
      attributes: data.attributes,
    };

    console.log(payload);

    try {
      if (mode === "create") {
        createMutation.mutate(payload, {
          onSuccess: () => {
            // alert(
            //   "Category created successfully"
            // );
            toast.success("Category created successfully")
            reset();
          },
        });
      } else {
        updateMutation.mutate(
          {
            id: categoryId,
            data: payload,
          },
          {
            onSuccess: () => {
              // alert(
              //   "Category updated successfully"
              // );
              toast.success("Category updated successfully")
            },
          }
        );
      }
      navigate("/admin-home")
    } catch (error) {
      console.error(error);
      toast.error('Failed to create category')
      // alert('Failed to create category');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {/* Header */}
          <div className="border-b border-slate-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === "create"
              ? "Create Category"
              : "Edit Category"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Define a product category and its
              attributes.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-8"
          >
            {/* Category Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Name
              </label>

              <input
                {...register("categoryName")}
                placeholder="e.g Shoes"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              {errors.categoryName && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.categoryName
                      .message
                  }
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={4}
                {...register(
                  "categoryDescription"
                )}
                placeholder="Category description..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              {errors.categoryDescription && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors
                      .categoryDescription
                      .message
                  }
                </p>
              )}
            </div>

            {/* Attributes */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiTag className="text-slate-600" />
                  <h3 className="font-semibold text-slate-800">
                    Attributes
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    append({ name: "" })
                  }
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  <FiPlus />
                  Add Attribute
                </button>
              </div>

              <div className="space-y-4">
                {fields.map(
                  (field, index) => (
                    <div
                      key={field.id}
                    >
                      <div className="flex gap-3">
                        <input
                          {...register(
                            `attributes.${index}.name`
                          )}
                          placeholder={`Attribute ${
                            index + 1
                          }`}
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />

                        {fields.length >
                          1 && (
                          <button
                            type="button"
                            onClick={() =>
                              remove(index)
                            }
                            className="rounded-lg bg-red-100 p-3 text-red-600 hover:bg-red-200"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>

                      {errors.attributes?.[
                        index
                      ]?.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {
                            errors
                              .attributes[
                              index
                            ]?.name
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting
                  ? "Saving..."
                  : (mode === "create"
                    ? "Create Category"
                    : "Update Category")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}