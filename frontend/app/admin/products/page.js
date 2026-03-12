"use client";

import { useState, useEffect } from "react";
import { adminProductService } from "@/api";
import Link from "next/link";
import { Plus, Edit3, Trash2, Package, Search, ExternalLink, Image as ImageIcon, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductModal from "@/components/admin/ProductModal";
import ProductViewModal from "@/components/admin/ProductViewModal";
import BulkEditProductsModal from "@/components/admin/BulkEditProductsModal";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewProduct, setViewProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isBulkOpen, setIsBulkOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const data = await adminProductService.getProducts();
            setProducts(Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : []);
        } catch (error) {
            console.error("Error fetching admin products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await adminProductService.delete(id);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleView = (product) => {
        setViewProduct(product);
        setIsViewOpen(true);
    };

    const filteredProducts = products.filter(p => {
        const name = (p.productName || p.name || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const id = (p._id?.toString() || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || category.includes(term) || id.includes(term);
    });

    const toggleSelected = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleBulkSave = async (payload) => {
        try {
            await adminProductService.bulkUpdate(payload);
            await fetchProducts();
            setSelectedProducts([]);
            setIsBulkOpen(false);
        } catch (error) {
            console.error("Bulk update failed:", error);
            throw error;
        }
    };

    return (
        <main className="min-h-screen">
            <section className="pb-8">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                        <div>
                            <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Admin</nav>
                            <h1 className="text-lg font-bold uppercase tracking-tight text-primary">Products</h1>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="btn-primary flex items-center gap-1.5 text-[10px] py-2 px-4"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Product</span>
                        </button>
                    </div>

                    <div className="bg-white shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-3 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-secondary/50 border border-gray-100 pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">{filteredProducts.length} items</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/30 border-b border-gray-100">
                                    <tr>
                                        <th className="px-2 py-2 w-8">
                                            <input
                                                type="checkbox"
                                                className="w-3 h-3 accent-primary"
                                                checked={
                                                    selectedProducts.length > 0 &&
                                                    selectedProducts.length === filteredProducts.length
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts(filteredProducts.map((p) => p._id));
                                                    } else {
                                                        setSelectedProducts([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">ID</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Product</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Category</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Price</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">Stock</th>
                                        <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-3 py-8 text-center text-[11px] text-gray-500 uppercase tracking-wider">
                                                No products. Add products from the database via &quot;Add Product&quot;.
                                            </td>
                                        </tr>
                                    ) : filteredProducts.map((p) => (
                                        <tr key={p._id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-2 py-2.5">
                                                <input
                                                    type="checkbox"
                                                    className="w-3 h-3 accent-primary"
                                                    checked={selectedProducts.includes(p._id)}
                                                    onChange={() => toggleSelected(p._id)}
                                                />
                                            </td>
                                            <td className="px-3 py-2.5 text-[10px] text-gray-400 font-mono">#{p._id?.toString().slice(-8)}</td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative w-10 h-12 bg-secondary/30 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                                                        {(p.thumbnails?.[0] || p.variants?.[0]?.images?.[0] || p.images?.[0]) ? (
                                                            <img
                                                                src={p.thumbnails?.[0] || p.variants?.[0]?.images?.[0] || p.images[0]}
                                                                alt={p.productName || p.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.style.display = "none"; e.target.nextElementSibling?.classList.remove("hidden"); }}
                                                            />
                                                        ) : null}
                                                        <div className={`absolute inset-0 flex items-center justify-center ${(p.thumbnails?.[0] || p.variants?.[0]?.images?.[0] || p.images?.[0]) ? "hidden" : ""}`}>
                                                            <ImageIcon className="w-4 h-4 text-gray-300" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">{p.productName || p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className="px-2 py-0.5 bg-secondary/50 text-[9px] font-bold uppercase tracking-wider text-gray-600 rounded">
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-[11px] font-bold">${Number(p.pricing?.sellingPrice ?? p.pricing?.offerPrice ?? p.price ?? 0).toFixed(2)}</td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-1">
                                                    <Package className={`w-3 h-3 ${(p.totalStock ?? p.countInStock ?? 0) < 10 ? 'text-red-500' : (p.totalStock ?? p.countInStock ?? 0) < 20 ? 'text-amber-500' : 'text-emerald-500'}`} />
                                                    <span className="text-[10px] font-medium">{p.totalStock ?? p.countInStock ?? 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => handleView(p)}
                                                        className="p-1.5 text-gray-400 hover:text-accent transition-colors"
                                                        title="Quick view"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(p)}
                                                        className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteHandler(p._id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <Link
                                                        href={`/product/${p._id}`}
                                                        target="_blank"
                                                        className="p-1.5 text-gray-400 hover:text-accent transition-colors"
                                                        title="View on storefront"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-2 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">{filteredProducts.length} products</span>
                        </div>
                    </div>
                </div>
            </section>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
            <ProductViewModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                product={viewProduct}
            />
            <BulkEditProductsModal
                isOpen={isBulkOpen}
                onClose={() => setIsBulkOpen(false)}
                products={products.filter((p) => selectedProducts.includes(p._id))}
                onSave={handleBulkSave}
            />

            <AnimatePresence>
                {selectedProducts.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.2 }}
                        type="button"
                        onClick={() => setIsBulkOpen(true)}
                        className="fixed bottom-5 right-5 z-[90] px-5 py-3 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wider shadow-lg hover:bg-primary/90"
                    >
                        Edit selected ({selectedProducts.length})
                    </motion.button>
                )}
            </AnimatePresence>
        </main>
    );
}
