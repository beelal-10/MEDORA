'use client';

import React, { useState, useRef } from 'react';
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

    const url = URL.createObjectURL(file);
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
    <div className="w-full max-w-xl mx-auto my-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-sky-500 bg-sky-50/80 scale-[1.01]'
            : 'border-slate-300 bg-white hover:border-sky-400 hover:bg-slate-50'
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
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-700">
              {loadingStep || t.scanning}
            </p>
            <p className="text-xs text-slate-500 mt-1">Transient processing in memory...</p>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center">
            <img
              src={previewUrl}
              alt="Medicine Package Preview"
              className="max-h-48 rounded-lg shadow-sm border border-slate-200 mb-4 object-contain"
            />
            <p className="text-xs text-sky-600 font-medium">Click or drop to replace photo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              {t.uploadPrompt}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{t.dragDropText}</p>
            <div className="inline-flex items-center gap-2 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">
              <Camera className="w-3.5 h-3.5" />
              {t.supportedFormats}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
