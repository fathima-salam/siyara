"use client";

import { X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductViewModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const mainThumb = product.thumbnails?.[0] || product.variants?.[0]?.images?.[0] || product.images?.[0] || null;
  const variants = Array.isArray(product.variants) ? product.variants : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          className="relative bg-white w-full max-w-2xl shadow-xl flex flex-col rounded-lg overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-tight text-gray-900">
                Product details
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                {product.productId || ""}
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

          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">General</h3>
                <p className="text-sm font-bold text-primary">
                  {product.productName || product.name}
                </p>
                <p className="text-xs text-gray-600">
                  {product.product}
                </p>
                <p className="text-[10px] mt-1">
                  <span className="font-semibold uppercase tracking-wider text-gray-500 mr-1">Category:</span>
                  <span className="uppercase tracking-wider text-gray-700 text-[10px] px-1.5 py-0.5 bg-secondary/40">
                    {product.category}
                  </span>
                </p>
                <p className="text-[10px] mt-1 text-gray-600">
                  <span className="font-semibold uppercase tracking-wider text-gray-500 mr-1">Brand:</span>
                  {product.brand}
                </p>
                {product.description && (
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Pricing</h3>
                <p className="text-sm font-bold text-primary">
                  ₹{Number(product.pricing?.sellingPrice ?? product.pricing?.offerPrice ?? 0).toFixed(2)}
                </p>
                {product.pricing?.offerPrice != null && (
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Offer: ₹{Number(product.pricing.offerPrice).toFixed(2)}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Buying: ₹{Number(product.pricing?.buyingPrice ?? 0).toFixed(2)}
                </p>
                <p className="text-[11px] text-gray-500">
                  Total stock: {product.totalStock ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-wider mt-1">
                  <span className="font-semibold text-gray-500 mr-1">Status:</span>
                  <span className="px-1.5 py-0.5 rounded bg-secondary/60 text-gray-700">
                    {product.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Preview</h3>
              <div className="flex gap-3 items-start">
                <div className="w-28 h-36 bg-secondary/40 border border-gray-200 rounded overflow-hidden flex items-center justify-center">
                  {mainThumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mainThumb}
                      alt="Main thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                {Array.isArray(product.thumbnails) && product.thumbnails.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {product.thumbnails.slice(1).map((t, idx) => (
                      <div
                        key={t || idx}
                        className="w-16 h-20 bg-secondary/40 border border-gray-200 rounded overflow-hidden flex items-center justify-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t}
                          alt="Thumb"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Variants</h3>
              {variants.length === 0 ? (
                <p className="text-[11px] text-gray-500">No variants configured.</p>
              ) : (
                <div className="space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v._id || v.color}
                      className="border border-gray-200 rounded p-2.5 bg-secondary/30 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-700">
                          Color: {v.color}
                        </p>
                        <p className="text-[11px] text-gray-600">
                          Qty: {v.quantity}{" "}
                          {v.sku && <span className="ml-2 text-[10px] text-gray-500">SKU: {v.sku}</span>}
                        </p>
                      </div>
                      <div className="flex gap-2 overflow-x-auto">
                        {(Array.isArray(v.images) ? v.images : []).map((img, idx) => (
                          <div
                            key={img || idx}
                            className="w-14 h-16 bg-secondary/40 border border-gray-200 rounded overflow-hidden flex items-center justify-center"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt="Variant"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

