"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Renders image only when src exists. Uses unoptimized for external URLs
 * to avoid Next.js upstream 404 errors. Shows placeholder on load error.
 */
export default function SafeImage({ src, alt = "", className, fill, ...props }) {
  const [error, setError] = useState(false);

  if (!src || typeof src !== "string" || !src.trim()) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className || ""}`}
        style={fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="text-gray-300 text-xs uppercase">No image</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className || ""}`}
        style={fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="text-gray-300 text-xs uppercase">No image</span>
      </div>
    );
  }

  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      unoptimized={isExternal}
      onError={() => setError(true)}
      {...props}
    />
  );
}
