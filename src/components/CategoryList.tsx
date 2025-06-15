import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

const CategoryList: React.FC = () => {
  const categories = useQuery(api.finance.listCategories);
  const deleteCategory = useMutation(api.finance.deleteCategory);
  const addDefaultCategories = useMutation(api.finance.addDefaultCategories); // Add mutation hook
  const [deletingId, setDeletingId] = React.useState<Id<"categories"> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoadingDefaults, setIsLoadingDefaults] = React.useState(false); // Loading state for defaults

  const handleDelete = async (categoryId: Id<"categories">) => {
    setError(null);
    setDeletingId(categoryId);
    try {
      await deleteCategory({ categoryId });
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      setError(err.message || "Failed to delete category. Check if it's linked to expenses.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddDefaults = async () => {
    setError(null);
    setIsLoadingDefaults(true);
    try {
      await addDefaultCategories({});
    } catch (err: any) {
      console.error("Failed to add default categories:", err);
      setError(err.message || "Failed to add default categories.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoadingDefaults(false);
    }
  };


  return (
    <div className="mt-6 bg-[#1a1a2e] p-4 rounded-lg border border-[#4a4a6e]">
      <h3 className="text-lg font-medium text-white mb-3">Existing Categories</h3>
       {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      {categories === undefined && <p className="text-gray-400">Loading categories...</p>}
      {categories && categories.length === 0 && (
        <div className="text-center py-4">
            <p className="text-gray-400 mb-3">No categories added yet.</p>
            <button
                onClick={handleAddDefaults}
                className="btn btn-secondary"
                disabled={isLoadingDefaults}
            >
                {isLoadingDefaults ? 'Adding Defaults...' : 'Add Default Categories'}
            </button>
        </div>
      )}
      {categories && categories.length > 0 && (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((category) => (
            <li key={category._id} className="flex justify-between items-center p-2 bg-[#2a2a4e] rounded">
              <span className="flex items-center">
                <span className="mr-2 text-xl">{category.icon ?? '❓'}</span>
                <span className="text-gray-200">{category.name}</span>
              </span>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-red-900/50 hover:bg-red-900/70 disabled:opacity-50"
                disabled={deletingId === category._id}
              >
                {deletingId === category._id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
       <p className="text-xs text-gray-500 mt-3">Note: Categories linked to expenses cannot be deleted.</p>
    </div>
  );
};

export default CategoryList;
