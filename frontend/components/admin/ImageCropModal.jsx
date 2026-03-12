"use client";

import { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

export default function ImageCropModal({
  isOpen,
  imageSrc,
  aspect = 3 / 4,
  title = "Crop image",
  onCancel,
  onCropComplete,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropSize = useMemo(() => ({ width: 240, height: Math.round(240 / aspect) }), [aspect]);

  const handleCropComplete = useCallback((_croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative bg-white w-full max-w-md rounded-lg overflow-hidden shadow-2xl border border-gray-200">
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-[11px] font-bold text-gray-900">{title}</div>
          <button type="button" onClick={onCancel} className="p-1.5 rounded hover:bg-gray-200 text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative bg-black" style={{ height: 360 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropSize={cropSize}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="px-3 py-3 border-t border-gray-200 bg-white space-y-2">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-semibold text-gray-700 w-10">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-[10px] font-semibold text-gray-700 hover:bg-gray-100 border border-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onCropComplete?.(croppedAreaPixels)}
              className="px-3 py-1.5 text-[10px] font-semibold bg-primary text-white rounded hover:bg-primary/90 flex items-center gap-1.5"
              disabled={!croppedAreaPixels}
            >
              <Check className="w-3.5 h-3.5" /> Use
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

