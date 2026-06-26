import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";
import { z } from "zod";
import { useCategory, useCategories } from "../hook/useCategory";
import { useCreateProduct, useProduct, useUpdateProduct } from "../hook/useProducts";

import { useWatch } from "react-hook-form";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(5, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  categoryId: z.coerce.number().min(1, "Select a category"),
  attributes: z.array(
    z.object({
      attributeName: z.string().min(1),
      attributeValue: z.string().min(1),
    })
  ),
  images: z.array(
    z.object({
      file: z.any(),
    })
  ).min(1, "At least one image is required"),
});


export default function ProductForm({mode = "create", productId = null}) {
  const productSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    description: z.string().min(5, "Description is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    categoryId: z.coerce.number().min(1, "Select a category"),
    attributes: z.array(
      z.object({
        attributeName: z.string(),
        attributeValue: z.string(),
      })
    ),
    
  });
  if ( mode === 'edit' ) {
    productSchema.extend({
      imagesToKeep: z.array(z.object({ id: z.number() })).optional(),
      images: z.array(
        z.object({
          file: z.any(),
        })
      ).optional(),
    });
  }
  if ( mode === 'create' ) {
    productSchema.extend({
      images: z.array(
        z.object({
          file: z.any(),
        })
      ).min(1, "At least one image is required"),
    });
  }


  const baseUrl = import.meta.env.VITE_API_IMAGE_URL; // for image display

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      attributes: [{ attributeName: "", attributeValue: "" }],
      images: [],
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { mutate: createProduct } = useCreateProduct();
  
  let product = null;
  let isLoading = false;
  if (mode === "edit" && productId) {
    const { data: productData, isLoading: productLoading } = useProduct(productId);
    product = productData;
    isLoading = productLoading;
    console.log("Fetched product for edit:", product);
  }
  
  
  // const { data: product, isLoading: productLoading } = useProduct(productId);
  const { mutate: updateProduct } = useUpdateProduct();
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const selectedCategory = categories?.find((c) => c.id === Number(selectedCategoryId));
  // prefill form when in edit mode
  useEffect(() => {
    if (mode === "edit" && product) {
      reset({
        name: product.name,
        description:
          product.description,
        price: product.price,
        categoryId:
          product.categoryId,

        attributes:
          product.attributes,

        images: [],
      });
    }
  }, [product, mode, reset]);

  // Set attributes based on selected category and mode is not edit!
  useEffect(() => {
    if (!selectedCategory) return;

    if (
      mode === "edit" &&
      product
    )
      return;

    setValue(
      "attributes",
      selectedCategory.attributes.map(
        (attr) => ({
          attributeName:
            attr.name,
          attributeValue: "",
        })
      )
    );
  }, [ selectedCategory, mode, product, setValue]);

  // State to hold existing images when in edit mode
  const [ existingImages, setExistingImages] = useState([]);
  useEffect(() => {
    if (
      mode === "edit" &&
      product
    ) {
      setExistingImages(
        product.images || []
      );
    }
  }, [product, mode]);



  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => addImage({ file }));
  };


  const buildFormData = (data) => {
    console.log("Building FormData with data:", data);
    const formData = new FormData();
    const productPayload = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
    };
    formData.append("product", new Blob([JSON.stringify(productPayload)], { type: "application/json" }));
    formData.append("attributes", new Blob([JSON.stringify(data.attributes)], { type: "application/json" }));
    if (mode === "edit" && data.images && data.images.length > 0) {
      data.images.forEach((img) => formData.append("images", img.file));
    } else if (mode === "create") {
      data.images.forEach((img) => formData.append("images", img.file));
    }
    return formData;
  };


  const onSubmit = async (data) => {
    const formData = buildFormData(data);
    if (mode === "create") {
      try {
        createProduct(formData);
        alert("Product created successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to create product");
      }
    } else if (mode === "edit") {
      let toKeep = existingImages.map((img) => (img.imgUrl ));
      console.log("Existing images to keep:", toKeep);
      formData.append("imagesToKeep", new Blob([JSON.stringify(toKeep)], { type: "application/json" }));
      try {
        updateProduct({ id: productId, formData });
        alert("Product updated successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to update product");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-slate-800">
              {mode === "create"
                ? "Create Product"
                : "Edit Product"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">Add a new product and define its attributes and images.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input {...register("name")} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea {...register("description")} rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
                <input type="number" {...register("price")} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
                <select {...register("categoryId")} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  { selectedCategoryId === "" && <option value="">Select category</option> }
                  { selectedCategoryId !== "" && <option value={selectedCategoryId}>{selectedCategory?.name}</option> }
                  {/* <option value="">Select category</option> */}
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiImage className="text-slate-600" />
                  <h3 className="font-semibold text-slate-800">Images</h3>
                </div>
              </div>

              <input type="file" multiple onChange={handleImageChange} className="mb-3" />
              {errors.images && (
                <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>
              )}

              <div className="grid grid-cols-4 gap-2">
                {imageFields.map((img, index) => (
                  <div key={img.id} className="border p-2 rounded">
                    <p className="text-xs truncate">{img.file?.name}</p>
                    <button type="button" onClick={() => removeImage(index)} className="text-red-500 text-xs">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border p-4 rounded-lg bg-slate-50">
              <h2 className="font-semibold mb-4">Category Attributes</h2>
              {!selectedCategory ? (
                <p className="text-slate-500">Select a category first</p>
              ) : (
                selectedCategory.attributes.map((attr, index) => (
                  <div key={attr.id} className="mb-4">
                    <label className="block text-sm font-medium mb-1">{attr.name}</label>
                    <input {...register(`attributes.${index}.attributeValue`)} placeholder={`Enter ${attr.name}`} className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    <input type="hidden" {...register(`attributes.${index}.attributeName`)} value={attr.name} />
                    {errors.attributes?.[index]?.attributeValue && <p className="mt-1 text-sm text-red-500">{errors.attributes[index].attributeValue.message}</p>}
                  </div>
                ))
              )}
            </div>

            {/* Preview existing images when in edit mode */}
            {mode === "edit" && existingImages.length > 0 && (
              <div className="border p-4 rounded-lg bg-slate-50">
                <h2 className="font-semibold mb-4">Existing Images</h2>
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map((img) => (
                    <div key={img.id} className="border p-2 rounded">
                      <img src={baseUrl + img.imgUrl} alt="" className="h-20 w-full object-cover" />
                      <button type="button" onClick={() => setExistingImages(existingImages.filter((i) => i.id !== img.id))} className="text-red-500 text-xs mt-1">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* <div className="grid grid-cols-4 gap-2">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="border p-2 rounded"
                >
                  <img
                    src={baseUrl + img.imageUrl}
                    alt=""
                    className="h-20 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setExistingImages(
                        existingImages.filter(
                          (i) =>
                            i.id !== img.id
                        )
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div> */}

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50">
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}