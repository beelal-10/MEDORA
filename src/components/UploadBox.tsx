'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Loader2, Camera } from 'lucide-react';
import { Language } from '@/types';
import { getTranslation } from '@/lib/i18n';

interface UploadBoxProps {
  language: Language;
  onImageSelected: (file: File) => void;
  isLoading: boolean;
  loadingStep?: string;
}

export default function UploadBox({ language, onImageSelected, isLoading, loadingStep }: UploadBoxProps) {
  const t = getTranslation(language);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreviewUrl(url);
    onImageSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mx-auto my-6 w-full max-w-xl">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`medora-card overflow-hidden rounded-[28px] p-4 transition-all duration-200 ${
          isDragOver
            ? 'scale-[1.01] border-emerald-300 bg-emerald-50/70'
            : 'border-slate-200 bg-white/80 hover:border-emerald-300 hover:bg-white'
        } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-200/70">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{loadingStep || t.scanning}</p>
            <p className="mt-1 text-xs text-slate-500">Processing securely in memory</p>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Medicine Package Preview"
              className="mb-4 max-h-52 rounded-2xl border border-slate-200 object-contain shadow-sm"
            />
            <p className="text-xs font-medium text-emerald-700">Click or drop to replace this photo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 sm:py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100 text-emerald-700 shadow-inner shadow-emerald-200/80">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h3 className="mb-2 text-lg font-bold text-slate-900">{t.uploadPrompt}</h3>
            <p className="mb-5 text-sm text-slate-500">{t.dragDropText}</p>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600">
              <Camera className="h-3.5 w-3.5 text-sky-700" />
              {t.supportedFormats}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
