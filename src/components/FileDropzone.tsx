"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".tiff", ".tif", ".bmp", ".svg", ".avif", ".heic", ".heif"],
};

export default function FileDropzone({ onFiles, disabled }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => { if (accepted.length > 0) onFiles(accepted); },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    disabled,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 select-none
        ${isDragReject
          ? "border-red-500 bg-red-500/5"
          : isDragActive
          ? "border-violet-400 bg-violet-500/10 scale-[1.01]"
          : "border-gray-200 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/5 bg-white dark:bg-zinc-900/40"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`p-3.5 rounded-full transition-colors ${isDragActive ? "bg-violet-500/20" : "bg-gray-100 dark:bg-zinc-800"}`}>
          {isDragActive
            ? <ImageIcon className="w-7 h-7 text-violet-500" />
            : <Upload className="w-7 h-7 text-gray-400 dark:text-zinc-400" />
          }
        </div>
        {isDragReject ? (
          <p className="text-red-500 font-medium">Only image files are accepted</p>
        ) : isDragActive ? (
          <p className="text-violet-500 font-semibold text-lg">Drop to add images</p>
        ) : (
          <>
            <div>
              <p className="text-zinc-800 dark:text-zinc-200 font-semibold text-base">Drag & drop images here</p>
              <p className="text-gray-400 dark:text-zinc-500 text-sm mt-0.5">or click to browse files</p>
            </div>
            <p className="text-gray-300 dark:text-zinc-600 text-xs">
              JPG · PNG · GIF · WebP · TIFF · BMP · SVG · AVIF · HEIC — any format, any quantity
            </p>
          </>
        )}
      </div>
    </div>
  );
}
