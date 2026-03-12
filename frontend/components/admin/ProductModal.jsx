"use client";

import { useState, useEffect } from "react";
import { X, Upload, Save, AlertCircle, Plus, Trash2, ChevronRight, ChevronLeft, Image as ImageIcon, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminProductService, adminCategoryService, adminBrandService } from "@/api";
import ImageCropModal from "./ImageCropModal";
import { getCroppedImg } from "@/utils/cropImage";

const STATUSES = ["draft", "active", "out_of_stock"];
const STEPS = ["General", "Pricing", "Variants & Images"];
const TOTAL_STEPS = 3;

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function generateProductId() {
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return id;
}

function generateSku(productId, color, index) {
  const baseId = String(productId || "")
    .replace(/[^A-Z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase();
  const colorPart = String(color || "")
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/gi, "")
    .slice(0, 3)
    .toUpperCase();
  const idx = String((index ?? 0) + 1).padStart(2, "0");
  return `${baseId}-${colorPart}-${idx}`;
}

const defaultForm = () => ({
  productId: generateProductId(),
  product: "",
  productName: "",
  category: "",
  brand: "",
  description: "",
  pricing: { buyingPrice: 0, sellingPrice: 0, offerPrice: undefined },
  variants: [{ color: "", quantity: 0, images: [], sku: "" }],
  status: "draft",
});

export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
  const [formData, setFormData] = useState(defaultForm());
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const [cropTarget, setCropTarget] = useState(null); // { type: 'variant', variantIndex, imageIndex?: number } imageIndex 0=main, >0=thumbnail at index, -1=append thumbnail
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  // Load categories and brands for dropdowns
  useEffect(() => {
    let mounted = true;
    const loadTaxonomy = async () => {
      try {
        const data = await adminCategoryService.getAll();
        const names = Array.isArray(data)
          ? data.map((c) => c.name).filter(Boolean)
          : [];
        if (mounted) {
          setCategoryOptions(names);
        }
      } catch {
        // silent fallback to static CATEGORIES
      }
      try {
        const bData = await adminBrandService.getAll();
        const bNames = Array.isArray(bData)
          ? bData.map((b) => b.name).filter(Boolean)
          : [];
        if (mounted && bNames.length) {
          setBrandOptions(bNames);
        }
      } catch {
        // brands dropdown falls back to free text if none loaded
      }
    };
    loadTaxonomy();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.productId ?? "",
        product: product.product ?? "",
        productName: product.productName ?? product.name ?? "",
        category: product.category ?? "",
        brand: product.brand ?? "",
        description: product.description ?? "",
        pricing: {
          buyingPrice: product.pricing?.buyingPrice ?? 0,
          sellingPrice: product.pricing?.sellingPrice ?? product.price ?? 0,
          offerPrice: product.pricing?.offerPrice ?? undefined,
        },
        variants: Array.isArray(product.variants) && product.variants.length > 0
          ? product.variants.map((v) => ({
              color: v.color ?? "",
              quantity: v.quantity ?? 0,
              images: Array.isArray(v.images) ? [...v.images] : [],
              sku: v.sku ?? "",
            }))
          : [{ color: "", quantity: 0, images: [], sku: "" }],
        status: product.status ?? "draft",
      });
    } else {
      setFormData({ ...defaultForm(), productId: generateProductId() });
    }
    setStep(0);
    setError("");
  }, [product, isOpen]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const productIdVal = (formData.productId && formData.productId.trim()) || (!product ? generateProductId() : "");
      const normalizedVariants = (formData.variants || [])
        .filter((v) => v && (v.color || "").trim() !== "");

      const payload = {
        productId: productIdVal,
        product: (formData.product || "").trim(),
        productName: (formData.productName || "").trim(),
        category: formData.category || "",
        brand: (formData.brand || "").trim(),
        description: (formData.description != null ? formData.description : "").trim(),
        pricing: {
          buyingPrice: Number(formData.pricing?.buyingPrice) || 0,
          sellingPrice: Number(formData.pricing?.sellingPrice) || 0,
          offerPrice: formData.pricing?.offerPrice != null && formData.pricing?.offerPrice !== ""
            ? Number(formData.pricing.offerPrice)
            : undefined,
        },
        variants: normalizedVariants.map((v, idx) => {
          const color = (v.color || "").trim();
          const quantity = Math.max(0, Number(v.quantity) || 0);
          const images = Array.isArray(v.images) ? v.images.filter(Boolean) : [];
          const existingSku = v.sku != null ? String(v.sku).trim() : "";
          const sku = existingSku || generateSku(productIdVal, color, idx);
          return { color, quantity, images, sku };
        }),
        thumbnails: (formData.variants || []).flatMap((v) =>
          (Array.isArray(v.images) ? v.images.filter(Boolean) : []).slice(0, 1)
        ),
        status: STATUSES.includes(formData.status) ? formData.status : "draft",
      };
      if (!payload.productId || !payload.product || !payload.productName || !payload.category || !payload.brand) {
        setError("Product ID, product, product name, category and brand are required.");
        setLoading(false);
        return;
      }
      if (payload.variants.length === 0) {
        setError("Add at least one variant with a color.");
        setLoading(false);
        return;
      }
      if (product) {
        await adminProductService.update(product._id, payload);
      } else {
        await adminProductService.create(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const goNext = () => {
    setError("");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const goBack = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const updatePricing = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value },
    }));

  const updateVariant = (index, field, value) =>
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));

  const addVariant = () =>
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", quantity: 0, images: [], sku: "" }],
    }));

  const removeVariant = (index) =>
    setFormData((prev) => {
      const next = prev.variants.filter((_, i) => i !== index);
      return { ...prev, variants: next.length ? next : [{ color: "", quantity: 0, images: [], sku: "" }] };
    });

  if (!isOpen) return null;

  const labelClass = "text-xs font-semibold uppercase tracking-wider text-gray-700";
  const inputClass = "w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white rounded";

  const openCrop = (file, target) => {
    const src = URL.createObjectURL(file);
    setCropSrc(src);
    setCropTarget(target);
    setCropOpen(true);
  };

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc("");
    setCropTarget(null);
    setCropOpen(false);
  };

  const handleCropped = async (croppedAreaPixels) => {
    if (!croppedAreaPixels || !cropTarget || !cropSrc) return;
    try {
      setError("");
      // Fixed size crop for product card (3:4)
      const blob = await getCroppedImg(cropSrc, croppedAreaPixels, 600, 800);
      const file = new File([blob], "product.jpg", { type: "image/jpeg" });
      const { url } = await adminProductService.uploadImage(file);

      setFormData((prev) => {
        if (cropTarget.type === "variant") {
          const idx = cropTarget.variantIndex;
          const imageIndex = cropTarget.imageIndex ?? 0;
          const nextVariants = prev.variants.map((v, i) => {
            if (i !== idx) return v;
            const imgs = Array.isArray(v.images) ? [...v.images.filter(Boolean)] : [];
            if (imageIndex === -1) {
              imgs.push(url);
            } else if (imageIndex === 0) {
              imgs[0] = url;
            } else {
              imgs[imageIndex] = url;
            }
            return { ...v, images: imgs };
          });
          return { ...prev, variants: nextVariants };
        }
        return prev;
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Image upload failed");
    } finally {
      closeCrop();
    }
  };

  return (
    <AnimatePresence>
      <div key="product-modal-backdrop" className="fixed inset-0 z-[100] flex items-center justify-center p-3">
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
          className="relative bg-white w-full max-w-lg shadow-xl flex flex-col rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-base font-bold uppercase tracking-tight text-gray-900">
                {product ? "Edit Product" : "Add Product"}
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                {step + 1}/{TOTAL_STEPS}: {STEPS[step]}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            {STEPS.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  step === i ? "text-primary border-b-2 border-primary bg-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          {/* Content: scroll when many variants */}
          <div className="p-4 min-h-[280px] max-h-[60vh] overflow-y-auto">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="px-3 py-2 bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 rounded text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="space-y-2.5"
                  >
                    <h3 className="text-xs font-bold text-gray-900 pb-1 border-b border-primary w-fit">General</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {product && (
                        <div className="space-y-1 col-span-2">
                          <label className={labelClass}>Product ID</label>
                          <input
                            required
                            type="text"
                            readOnly
                            className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                            value={formData.productId}
                            placeholder="Auto-generated"
                          />
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Auto-generated (10 characters, letters & numbers)
                          </p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className={labelClass}>Product (classification)</label>
                        <select
                          required
                          className={inputClass}
                          value={formData.product}
                          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                        >
                          <option value="">Select type</option>
                          <option value="Hijabs">Hijabs</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Earring">Earring</option>
                          <option value="Rings">Rings</option>
                          <option value="Necklace">Necklace</option>
                          {formData.product && !["Hijabs", "Accessories", "Earring", "Rings", "Necklace"].includes(formData.product) && (
                            <option value={formData.product}>{formData.product}</option>
                          )}
                        </select>
                        <p className="text-[10px] text-gray-500 mt-0.5">Used for shop filter (All, Hijabs, Accessories, etc.)</p>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Product Name</label>
                        <input
                          required
                          type="text"
                          className={inputClass}
                          value={formData.productName}
                          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                          placeholder="Premium Chiffon"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Category</label>
                        <select
                          className={inputClass}
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="">Select category</option>
                          {categoryOptions.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          {!categoryOptions.includes(formData.category) && formData.category && (
                            <option value={formData.category}>{formData.category}</option>
                          )}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Status</label>
                        <select
                          className={inputClass}
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelClass}>Brand</label>
                        <select
                          className={inputClass}
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        >
                          <option value="">Select brand</option>
                          {brandOptions.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                          {!brandOptions.includes(formData.brand) && formData.brand && (
                            <option value={formData.brand}>{formData.brand}</option>
                          )}
                        </select>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea
                          rows={2}
                          className={`${inputClass} resize-none`}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Product description"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="pricing"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="space-y-2.5"
                  >
                    <h3 className="text-xs font-bold text-gray-900 pb-1 border-b border-primary w-fit">Pricing</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className={labelClass}>Buying (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          className={inputClass}
                          value={formData.pricing.buyingPrice}
                          onChange={(e) => updatePricing("buyingPrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Selling (₹)</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          min={0}
                          className={inputClass}
                          value={formData.pricing.sellingPrice}
                          onChange={(e) => updatePricing("sellingPrice", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Offer (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          className={inputClass}
                          value={formData.pricing.offerPrice ?? ""}
                          onChange={(e) => updatePricing("offerPrice", e.target.value === "" ? undefined : e.target.value)}
                          placeholder="—"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="variants"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xs font-bold text-gray-900 pb-1 border-b border-primary w-fit">Variants & images</h3>
                    <p className="text-xs text-gray-600">Each variant: one main image (first) and multiple thumbnails. Images shown horizontally below with delete and replace.</p>

                    {/* Variants: main image + multiple thumbnails, horizontal at bottom */}
                    {formData.variants.map((v, vIdx) => {
                      const imgs = Array.isArray(v.images) ? v.images.filter(Boolean) : [];
                      const setVariantImages = (newImages) =>
                        setFormData((prev) => ({
                          ...prev,
                          variants: prev.variants.map((vb, i) =>
                            i === vIdx ? { ...vb, images: newImages } : vb
                          ),
                        }));
                      const removeImageAt = (imgIdx) =>
                        setVariantImages(imgs.filter((_, i) => i !== imgIdx));
                      const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='55' fill='%239ca3af' font-size='12' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";
                      return (
                      <div key={`variant-${vIdx}`} className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50/50">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-800">Variant {vIdx + 1}</span>
                          {formData.variants.length > 1 && (
                            <button type="button" onClick={() => removeVariant(vIdx)} className="text-xs text-red-600 hover:underline font-medium">
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          <div className="space-y-1.5">
                            <label className={labelClass}>Color</label>
                            <input
                              type="text"
                              className={inputClass}
                              value={v.color}
                              onChange={(e) => updateVariant(vIdx, "color", e.target.value)}
                              placeholder="Black"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className={labelClass}>Qty</label>
                            <input
                              type="number"
                              min={0}
                              className={inputClass}
                              value={v.quantity}
                              onChange={(e) => updateVariant(vIdx, "quantity", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2">
                            <label className={labelClass}>SKU</label>
                            <input
                              type="text"
                              className={inputClass}
                              value={v.sku}
                              onChange={(e) => updateVariant(vIdx, "sku", e.target.value)}
                              placeholder="Optional"
                            />
                          </div>
                        </div>

                        {/* Images section: more spacing, clearer separation */}
                        <div className="pt-3 border-t border-gray-200 space-y-3">
                          <label className={`${labelClass} block`}>Main image & thumbnails</label>
                          {imgs.length === 0 ? (
                            <div className="py-4 px-4 rounded-lg border border-dashed border-gray-300 bg-white/50 text-xs text-gray-500 flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-gray-400 shrink-0" />
                              No images yet. Upload a main image below.
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-3 overflow-x-auto py-1 min-h-[100px]">
                              {imgs.map((img, imgIdx) => (
                                <div key={`${vIdx}-${imgIdx}-${img}`} className="relative shrink-0 w-24 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm group">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-full aspect-[3/4] object-cover bg-gray-100"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = placeholderSvg;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const fileInput = document.createElement("input");
                                        fileInput.type = "file";
                                        fileInput.accept = "image/*";
                                        fileInput.onchange = (ev) => {
                                          const file = ev.target?.files?.[0];
                                          if (file) openCrop(file, { type: "variant", variantIndex: vIdx, imageIndex: imgIdx });
                                        };
                                        fileInput.click();
                                      }}
                                      className="p-2 bg-white rounded-md text-gray-700 hover:bg-gray-100 shadow"
                                      title="Replace"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removeImageAt(imgIdx)}
                                      className="p-2 bg-white rounded-md text-red-600 hover:bg-red-50 shadow"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  {imgIdx === 0 && (
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white text-center py-1 font-medium">Main</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-3 pt-1">
                            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 cursor-pointer transition-colors">
                              <Upload className="w-4 h-4" />
                              {imgs.length === 0 ? "Upload main image" : "Replace main"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = "";
                                  if (!file) return;
                                  openCrop(file, { type: "variant", variantIndex: vIdx, imageIndex: 0 });
                                }}
                              />
                            </label>
                            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer transition-colors">
                              <Plus className="w-4 h-4" />
                              Add thumbnail
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = "";
                                  if (!file) return;
                                  openCrop(file, { type: "variant", variantIndex: vIdx, imageIndex: -1 });
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ); })}
                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-primary border border-gray-300 border-dashed rounded p-2.5 w-full justify-center"
                    >
                      <Plus className="w-4 h-4" /> Add variant
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-red-600">
                  Discard
                </button>
              )}
            </div>
            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-primary/90"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-3 py-2 btn-primary text-xs font-semibold min-w-[140px] justify-center"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {product ? "Update" : "Create"}
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <ImageCropModal
        key="product-modal-crop"
        isOpen={cropOpen}
        imageSrc={cropSrc}
        aspect={3 / 4}
        title="Crop image (product card)"
        onCancel={closeCrop}
        onCropComplete={handleCropped}
      />
    </AnimatePresence>
  );
}
