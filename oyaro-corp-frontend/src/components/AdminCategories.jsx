import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiX, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import adminService from '../service/adminService';

// Zod validation schema
const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  parentId: z.coerce.number().optional().nullable(),
});

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  // Fetch categories
  const { data: categoriesData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await adminService.getCategories();
      return response.data;
    },
  });

  // Create/Update mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      if (editingCategory) {
        return adminService.updateCategory(editingCategory.id, data);
      } else {
        return adminService.createCategory(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setShowModal(false);
      reset();
      setEditingCategory(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (categoryId) => adminService.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('parentId', category.parentId || null);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    reset();
    setShowModal(true);
  };

  // Flatten categories for display
  const flattenCategories = (nodes) => {
    if (!nodes) return [];
    let flattened = [];
    const traverse = (node, level = 0) => {
      flattened.push({ ...node, level });
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child, level + 1));
      }
    };
    nodes.forEach((node) => traverse(node));
    return flattened;
  };

  const flatCategories = flattenCategories(categoriesData);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Manage Categories</h2>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <FiPlus size={20} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Parent Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Path
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categoriesLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : flatCategories.length > 0 ? (
              flatCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td
                    className="px-6 py-4 text-sm text-gray-700"
                    style={{ paddingLeft: `${1.5 + category.level * 1.5}rem` }}
                  >
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {category.parentId ? `ID: ${category.parentId}` : 'Root'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{category.path}</td>
                  <td className="px-6 py-4 text-sm gap-4 flex">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(category.id)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                  reset();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category (Optional)
                </label>
                <select
                  {...register('parentId')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.parentId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">None (Root Category)</option>
                  {flatCategories
                    .filter((cat) => cat.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {' '.repeat(cat.level * 2)}
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors font-medium"
                >
                  {createMutation.isPending ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    reset();
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
