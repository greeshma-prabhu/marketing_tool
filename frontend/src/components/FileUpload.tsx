'use client'

import { useState, useRef, DragEvent } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface FileUploadProps {
  accept?: string
  maxSizeMB?: number
  onFileSelect: (file: File | null, dataUrl: string | null) => void
  currentFile?: string | null
  label: string
  placeholder?: string
  required?: boolean
  type: 'image' | 'logo'
}

export default function FileUpload({
  accept,
  maxSizeMB = 5,
  onFileSelect,
  currentFile,
  label,
  placeholder,
  required = false,
  type = 'image',
}: FileUploadProps) {
  const { t } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentFile || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    setError(null)
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const errorMsg = t('inputPage.fileTooLarge').replace('{maxSize}', maxSizeMB.toString())
      setError(errorMsg)
      return false
    }

    // Check file type
    const validTypes = type === 'image' 
      ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      : ['image/png', 'image/svg+xml']
    
    if (!validTypes.includes(file.type)) {
      const typeStr = type === 'image' ? 'JPG, PNG, WebP' : 'PNG, SVG'
      const errorMsg = t('inputPage.invalidFileType').replace('{type}', typeStr)
      setError(errorMsg)
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (!validateFile(file)) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)
      onFileSelect(file, dataUrl)
      setError(null)
    }
    reader.onerror = () => {
      setError(t('inputPage.fileReadError'))
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onFileSelect(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError(null)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
          ${preview ? 'bg-gray-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept || (type === 'image' ? 'image/jpeg,image/jpg,image/png,image/webp' : 'image/png,image/svg+xml')}
          onChange={handleFileInput}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className={`${type === 'image' ? 'max-h-48' : 'max-h-24'} max-w-full rounded-lg object-contain mx-auto`}
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('inputPage.changeFile')}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('inputPage.removeFile')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-gray-400 text-4xl mb-2">
              {type === 'image' ? '📷' : '🏢'}
            </div>
            <p className="text-sm text-gray-600">
              {placeholder || t('inputPage.dragDropOrClick')}
            </p>
            <p className="text-xs text-gray-500">
              {type === 'image' 
                ? t('inputPage.acceptedFormatsImage').replace('{maxSize}', maxSizeMB.toString())
                : t('inputPage.acceptedFormatsLogo').replace('{maxSize}', maxSizeMB.toString())
              }
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('inputPage.selectFile')}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

