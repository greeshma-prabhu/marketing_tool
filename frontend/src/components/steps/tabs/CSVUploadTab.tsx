'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { useOnepager, ProductData } from '@/contexts/OnepagerContext'
import { Upload, FileText, Download } from 'lucide-react'

export default function CSVUploadTab() {
  const { setProductData } = useOnepager()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const text = await file.text()
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const rows = results.data as any[]
            if (rows.length === 0) {
              setError('CSV file is empty')
              setLoading(false)
              return
            }

            // Process all rows for bulk generation
            const products: ProductData[] = rows.map((row: any) => {
              // Helper to convert image path/URL to base64 if needed
              const processImage = async (imagePath: string | undefined): Promise<string | undefined> => {
                if (!imagePath) return undefined
                // If it's a URL, return as-is
                if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                  return imagePath
                }
                // If it's a local path, try to read as base64 (for future file system access)
                // For now, return URL if it looks like one
                return imagePath
              }

              return {
                productName: row.productName || row.product_name || row.name || '',
                description: row.description || row.desc || '',
                features: [
                  row.feature1 || row.feature_1,
                  row.feature2 || row.feature_2,
                  row.feature3 || row.feature_3,
                  row.feature4 || row.feature_4,
                  row.feature5 || row.feature_5,
                  row.feature6 || row.feature_6,
                ].filter(Boolean),
                imageUrl: row.imageUrl || row.image_url || row.image || row.imagePath || row.image_path,
                imageFile: row.imageFile || row.image_file, // base64 if provided
                logoUrl: row.logoUrl || row.logo_url || row.logo || row.logoPath || row.logo_path,
                logoFile: row.logoFile || row.logo_file, // base64 if provided
                website: row.website || row.url,
                email: row.email,
                phone: row.phone || row.telephone,
                socialMedia: {
                  facebook: row.facebook || row.fb,
                  twitter: row.twitter || row.x,
                  linkedin: row.linkedin,
                  instagram: row.instagram || row.ig,
                },
                campaignMessage: row.campaignMessage || row.campaign_message || row.message,
                cta: row.cta || row.call_to_action,
              }
            }).filter(p => p.productName) // Only include rows with product names

            if (products.length === 0) {
              setError('CSV must contain at least one row with a productName column')
              setLoading(false)
              return
            }

            // If multiple products, save all to localStorage for bulk processing
            if (products.length > 1) {
              const existingBulk = JSON.parse(localStorage.getItem('bulkProducts') || '[]')
              const updatedBulk = [...existingBulk, ...products]
              localStorage.setItem('bulkProducts', JSON.stringify(updatedBulk))
              setError(`Loaded ${products.length} products. Use first product for current workflow.`)
            }

            // Use first product for current workflow
            setProductData(products[0])
          } catch (err: any) {
            setError(err.message || 'Failed to parse CSV data')
            setLoading(false)
          }
        },
        error: (err: Error) => {
          setError(err.message || 'Failed to parse CSV file')
          setLoading(false)
        },
      })
    } catch (err: any) {
      setError(err.message || 'Failed to read file')
      setLoading(false)
    }
  }, [setProductData])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv'],
    },
    multiple: false,
  })

  const downloadSample = () => {
    const sample = `productName,description,feature1,feature2,feature3,feature4,imageUrl,imagePath,logoUrl,logoPath,website,email,phone,facebook,twitter,linkedin,instagram,campaignMessage,cta
My Product,This is an amazing product that solves real problems,Feature 1,Feature 2,Feature 3,Feature 4,https://example.com/image.jpg,./images/product1.jpg,https://example.com/logo.png,./logos/logo1.png,https://example.com,contact@example.com,+1-555-1234,https://facebook.com/example,https://twitter.com/example,https://linkedin.com/company/example,https://instagram.com/example,Join us today!,Get Started
Another Product,Another great product description,Feature A,Feature B,Feature C,Feature D,https://example.com/image2.jpg,./images/product2.jpg,https://example.com/logo2.png,./logos/logo2.png,https://example2.com,contact2@example.com,+1-555-5678,https://facebook.com/example2,https://twitter.com/example2,https://linkedin.com/company/example2,https://instagram.com/example2,Join us!,Start Now`
    
    const blob = new Blob([sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-product-data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-indigo-600 font-medium">Drop the CSV file here...</p>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              Drag and drop a CSV file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports CSV files with product data
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Processing CSV...</p>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <FileText className="h-5 w-5" />
            <span className="text-sm">Need a sample CSV template?</span>
          </div>
          <button
            onClick={downloadSample}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Sample</span>
          </button>
        </div>
      </div>
    </div>
  )
}

