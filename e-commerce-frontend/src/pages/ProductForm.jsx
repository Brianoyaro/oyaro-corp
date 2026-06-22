import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";
import { z } from "zod";

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
  ),
});

export default function ProductForm() {
  const [categories, setCategories] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
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

  const {
    fields: attributeFields,
    append: addAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "attributes",
  });

  const {
    fields: imageFields,
    append: addImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Handle file input separately
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      addImage({ file });
    });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    const productPayload = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
    };

    formData.append(
      "product",
      new Blob([JSON.stringify(productPayload)], {
        type: "application/json",
      })
    );

    formData.append(
      "attributes",
      new Blob([JSON.stringify(data.attributes)], {
        type: "application/json",
      })
    );

    data.images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      await axios.post(
        "http://localhost:8080/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white shadow-lg border p-6">
        <h1 className="text-2xl font-bold mb-6">
          Create Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              {...register("name")}
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-sm">
              {errors.name?.message}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              className="w-full border p-3 rounded-lg"
            />
            <p className="text-red-500 text-sm">
              {errors.description?.message}
            </p>
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                {...register("price")}
                className="w-full border p-3 rounded-lg"
              />
              <p className="text-red-500 text-sm">
                {errors.price?.message}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                {...register("categoryId")}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-sm">
                {errors.categoryId?.message}
              </p>
            </div>
          </div>

          {/* Attributes */}
          <div className="border p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between mb-3">
              <h2 className="font-semibold">Attributes</h2>

              <button
                type="button"
                onClick={() =>
                  addAttribute({
                    attributeName: "",
                    attributeValue: "",
                  })
                }
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                <FiPlus /> Add
              </button>
            </div>

            {attributeFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(
                    `attributes.${index}.attributeName`
                  )}
                  placeholder="Name"
                  className="border p-2 rounded w-1/2"
                />

                <input
                  {...register(
                    `attributes.${index}.attributeValue`
                  )}
                  placeholder="Value"
                  className="border p-2 rounded w-1/2"
                />

                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="border p-4 rounded-lg bg-slate-50">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <FiImage /> Images
            </h2>

            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mb-3"
            />

            <div className="grid grid-cols-4 gap-2">
              {imageFields.map((img, index) => (
                <div
                  key={img.id}
                  className="border p-2 rounded"
                >
                  <p className="text-xs truncate">
                    {img.file?.name}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full"
          >
            {isSubmitting ? "Saving..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}