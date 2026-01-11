'use client'

import { useState } from 'react'
import { useOnepager, ProductData } from '@/contexts/OnepagerContext'
import { API_BASE_URL } from '@/config/api'
import { Globe, Loader } from 'lucide-react'

export default function WebsiteScraperTab() {
  const { setProductData } = useOnepager()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/scrape-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape website')
      }

      const data = await response.json()
      
      // Process images - convert to base64 if provided as base64, otherwise use URL
      const processImage = (img: string | undefined): { url?: string; file?: string } => {
        if (!img) return {}
        if (img.startsWith('data:image')) {
          return { file: img } // Already base64
        }
        return { url: img } // URL
      }

      const imageData = processImage(data.imageUrl || data.image || data.imageFile)
      const logoData = processImage(data.logoUrl || data.logo || data.logoFile)
      
      const productData: ProductData = {
        productName: data.productName || data.name || '',
        description: data.description || '',
        features: data.features || [],
        imageUrl: imageData.url,
        imageFile: imageData.file,
        logoUrl: logoData.url,
        logoFile: logoData.file,
        website: url,
        email: data.email,
        phone: data.phone,
        socialMedia: data.socialMedia || {},
        campaignMessage: data.campaignMessage || data.message,
        cta: data.cta,
      }

      if (!productData.productName) {
        setError('Could not extract product name from the website. Please try manual input.')
        setLoading(false)
        return
      }

      setProductData(productData)
    } catch (err: any) {
      setError(err.message || 'Failed to scrape website. Please try manual input or CSV upload.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleScrape} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website URL *
        </label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Scraping...</span>
              </>
            ) : (
              <span>Scrape</span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> This feature extracts product information from the website automatically. 
          If scraping fails, please use manual input or CSV upload instead.
        </p>
      </div>
    </form>
  )
}

