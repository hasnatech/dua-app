
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onFileChange: (file: File) => void;
  previewUrl?: string;
}

export default function ImageUpload({ onFileChange, previewUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileChange(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
        isDragActive ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto h-48" />
      ) : (
        <p>Drag 'n' drop an image here, or click to select one.</p>
      )}
    </div>
  );
}
