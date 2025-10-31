// src/pages/Admin/CategoryList.jsx
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice.js";
import { toast } from "react-toastify";
import Modal from "../../components/Model.jsx";
import AdminMenu from "./AdminMenu.jsx";

const CategoryList = () => {
  const { data: categories, isLoading } = useFetchCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name required");

    try {
      const result = await createCategory({ name }).unwrap();
      toast.success(`"${result.name}" created`);
      setName("");
    } catch (err) {
      toast.error(err?.data?.message || "Create failed");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
  };

  const saveEdit = async () => {
    if (!editingName.trim()) return toast.error("Name required");

    try {
      const result = await updateCategory({
        categoryId: editingId,
        updatedCategory: { name: editingName },
      }).unwrap();

      toast.success(`"${result.name}" updated`);
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const confirmDelete = (cat) => setShowConfirm(cat._id);
  const cancelDelete = () => setShowConfirm(null);

  const executeDelete = async () => {
    const cat = categories.find((c) => c._id === showConfirm);
    try {
      await deleteCategory(showConfirm).unwrap();
      toast.success(`"${cat.name}" deleted`);
      cancelDelete();
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <AdminMenu />

        {/* Main Area */}
        <div className="flex-1 space-y-8">
          {/* Header */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <h1 className="text-2xl font-bold text-white mb-2">
              Category Dashboard
            </h1>
            <p className="text-gray-400">
              {isLoading
                ? "Loading..."
                : `${categories?.length || 0} categories`}
            </p>
          </div>

          {/* Create New */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Add New Category
            </h2>
            <form onSubmit={handleCreate} className="flex gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Create
              </button>
            </form>
          </div>

          {/* Categories List – Card Stack */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : !categories || categories.length === 0 ? (
              <div className="bg-slate-800 rounded-xl p-12 text-center">
                <p className="text-gray-400 text-lg">No categories yet.</p>
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-slate-800 rounded-xl p-5 shadow-md border border-slate-700 flex items-center justify-between gap-4"
                >
                  {editingId === cat._id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-medium text-white">
                        {cat.name}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(cat)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!showConfirm} onClose={cancelDelete}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">
            Delete Category?
          </h3>
          <p className="text-gray-300 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={executeDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;
