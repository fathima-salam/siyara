"use client";

import { useEffect, useState } from "react";
import { adminCategoryService } from "@/api";
import { Plus, Edit3, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const data = await adminCategoryService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
      };
      if (!payload.name || !payload.slug) {
        setError("Name and slug are required.");
        return;
      }
      if (editingId) {
        await adminCategoryService.update(editingId, payload);
      } else {
        await adminCategoryService.create(payload);
      }
      await loadCategories();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save category.");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await adminCategoryService.delete(id);
      await loadCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  return (
    <main className="min-h-screen">
      <section className="pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <div>
              <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Admin</nav>
              <h1 className="text-lg font-bold uppercase tracking-tight text-primary">Categories</h1>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 p-4 mb-5">
            <h2 className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-3">
              {editingId ? "Edit category" : "Add category"}
            </h2>
            {error && (
              <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                  Name
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Hijabs"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                  Slug
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. hijabs"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                  Description
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="flex gap-2 md:justify-end col-span-1 md:col-span-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-2 text-[10px] font-semibold border border-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-1.5 text-[10px] py-2 px-4"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingId ? "Update category" : "Add category"}</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-sm border border-gray-100">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                {categories.length} categories
              </span>
            </div>
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-500">Loading…</div>
            ) : categories.length === 0 ? (
              <div className="p-6 text-center text-[11px] text-gray-500 uppercase tracking-wider">
                No categories yet.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-secondary/30 border-b border-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      Name
                    </th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      Slug
                    </th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      Description
                    </th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((c) => (
                    <tr key={c._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider">
                        {c.name}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-gray-600 font-mono">{c.slug}</td>
                      <td className="px-3 py-2.5 text-[11px] text-gray-600">
                        {c.description || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

