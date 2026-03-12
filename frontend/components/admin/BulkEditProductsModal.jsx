"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STATUSES = ["draft", "active", "out_of_stock"];

// Resolve image URL: relative paths (e.g. /uploads/...) need API base when frontend and API differ
function resolveImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  const u = url.trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "";
  return base ? `${base}${u.startsWith("/") ? u : `/${u}`}` : u;
}

export default function BulkEditProductsModal({ isOpen, onClose, products, onSave }) {
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Group rows by product for rowSpan display (Product col = Header 1, Color/SKU = Header 2/2', rest = Header 3)
  const productGroups = (() => {
    const byId = {};
    (rows || []).forEach((row, index) => {
      const key = row.mongoId || row.productId;
      if (!byId[key]) byId[key] = { product: row, variants: [] };
      byId[key].variants.push({ ...row, rowIndex: index });
    });
    return Object.values(byId);
  })();

  useEffect(() => {
    if (!isOpen) return;
    const nextRows = [];
    (products || []).forEach((p) => {
      const productFallbackImage =
        (p.thumbnails && p.thumbnails[0]) ||
        (p.variants && p.variants[0]?.images?.[0]) ||
        (Array.isArray(p.images) && p.images[0]) ||
        null;
      const variants = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants : [{ color: "", quantity: 0, sku: "", images: [] }];
      variants.forEach((v, idx) => {
        const raw = v?.images;
        const variantImages = Array.isArray(raw)
          ? raw.map((u) => (u != null ? String(u).trim() : "")).filter(Boolean)
          : raw != null && raw !== "" ? [String(raw).trim()] : [];
        const mainImage = variantImages[0] || productFallbackImage;
        nextRows.push({
          productId: p.productId,
          mongoId: p._id,
          productName: p.productName || p.name || "",
          mainImage,
          variantImages,
          status: p.status || "draft",
          buyingPrice: Number(p.pricing?.buyingPrice ?? 0),
          sellingPrice: Number(p.pricing?.sellingPrice ?? 0),
          offerPrice: p.pricing?.offerPrice != null ? Number(p.pricing.offerPrice) : "",
          variantIndex: idx,
          color: v.color || "",
          quantity: Number(v.quantity ?? 0),
          sku: v.sku || "",
        });
      });
    });
    setRows(nextRows);
    setError("");
    setSaving(false);
  }, [isOpen, products]);

  if (!isOpen) return null;

  const updateRowField = (idx, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== idx) return row;
        return { ...row, [field]: value };
      })
    );
  };

  const updateProductField = (productId, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.productId === productId ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = async () => {
    setError("");
    try {
      const grouped = {};
      for (const row of rows) {
        if (!row.productId) {
          throw new Error("Missing productId in bulk edit data.");
        }
        if (!grouped[row.productId]) {
          grouped[row.productId] = {
            productId: row.productId,
            pricing: {
              buyingPrice: row.buyingPrice,
              sellingPrice: row.sellingPrice,
              offerPrice: row.offerPrice === "" ? undefined : row.offerPrice,
            },
            status: row.status,
            variants: [],
          };
        }
        grouped[row.productId].variants.push({
          color: row.color,
          quantity: row.quantity,
          sku: row.sku,
        });
      }
      const payload = { products: Object.values(grouped) };
      await onSave(payload);
    } catch (err) {
      setError(err.message || "Failed to prepare bulk update.");
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative bg-white w-full max-w-5xl shadow-xl flex flex-col rounded-lg overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                Bulk Edit Products
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                {rows.length} variant{rows.length === 1 ? "" : "s"} selected
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-secondary/40 border-b-2 border-gray-300 z-10">
                  <tr>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-600 border-r border-gray-200 bg-gray-100/80">
                      Product
                    </th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-600 border-r border-gray-200 bg-gray-100/80">
                      Image
                    </th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      Color
                    </th>
                    <th className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      SKU
                    </th>
                    <th colSpan={5} className="px-3 py-2 text-[9px] uppercase tracking-wider font-bold text-gray-500 border-l border-gray-200">
                      Edit (per variant / product)
                    </th>
                  </tr>
                  <tr className="bg-gray-50/80">
                    <th className="border-r border-gray-200" />
                    <th className="border-r border-gray-200" />
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500" />
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500" />
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500">Quantity</th>
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500">Buying</th>
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500">Selling</th>
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500">Offer</th>
                    <th className="px-3 py-1.5 text-[9px] font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productGroups.map((group, gIdx) => {
                    const { product, variants } = group;
                    const rowSpan = variants.length;
                    return variants.map((row, vIdx) => (
                      <tr
                        key={`${product.mongoId}-${row.variantIndex}-${gIdx}-${vIdx}`}
                        className={vIdx > 0 ? "bg-gray-50/50" : ""}
                      >
                        {vIdx === 0 && (
                          <td
                            rowSpan={rowSpan}
                            className="px-3 py-2 align-top border-r border-gray-200 bg-white font-bold text-[11px] uppercase tracking-wider text-gray-800 min-w-[120px]"
                          >
                            <span className="truncate block">{product.productName}</span>
                          </td>
                        )}
                        <td className="px-2 py-2 align-top border-r border-gray-200 bg-white">
                          {row.mainImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolveImageUrl(row.mainImage)}
                              alt={row.color ? `Variant ${row.color}` : ""}
                              className="w-10 h-12 object-cover rounded border border-gray-200 bg-gray-100"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-12 bg-secondary/40 border border-gray-200 rounded" />
                          )}
                        </td>
                        <td className="px-3 py-2 text-[11px] text-gray-700 bg-white">
                          {row.color}
                        </td>
                        <td className="px-3 py-2 text-[11px] text-gray-600 bg-white">
                          {row.sku || "—"}
                        </td>
                        <td className="px-3 py-2 bg-white">
                          <input
                            type="number"
                            min={0}
                            className="w-20 border border-gray-300 px-2 py-1 text-xs rounded"
                            value={row.quantity}
                            onChange={(e) =>
                              updateRowField(row.rowIndex, "quantity", Number(e.target.value) || 0)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 bg-white">
                          <input
                            type="number"
                            min={0}
                            className="w-24 border border-gray-300 px-2 py-1 text-xs rounded"
                            value={row.buyingPrice}
                            onChange={(e) =>
                              updateProductField(
                                row.productId,
                                "buyingPrice",
                                Number(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 bg-white">
                          <input
                            type="number"
                            min={0}
                            className="w-24 border border-gray-300 px-2 py-1 text-xs rounded"
                            value={row.sellingPrice}
                            onChange={(e) =>
                              updateProductField(
                                row.productId,
                                "sellingPrice",
                                Number(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 bg-white">
                          <input
                            type="number"
                            min={0}
                            className="w-24 border border-gray-300 px-2 py-1 text-xs rounded"
                            value={row.offerPrice}
                            onChange={(e) =>
                              updateProductField(
                                row.productId,
                                "offerPrice",
                                e.target.value === "" ? "" : Number(e.target.value) || 0
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 bg-white">
                          <select
                            className="border border-gray-300 px-2 py-1 text-xs rounded"
                            value={row.status}
                            onChange={(e) =>
                              updateProductField(row.productId, "status", e.target.value)
                            }
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <button
              type="button"
              className="px-3 py-2 text-[10px] font-semibold text-gray-700 hover:text-red-600"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary text-xs min-w-[140px] flex items-center justify-center"
              onClick={() => {
                setSaving(true);
                handleSave();
              }}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

