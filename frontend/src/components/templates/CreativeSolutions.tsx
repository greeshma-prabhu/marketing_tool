'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { Sparkles } from 'lucide-react'

interface Props {
  data: ProductData
  variant?: Variant
}

export function CreativeSolutions({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white">
      {/* Header - Gradient */}
      <div className="h-[80mm] bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white p-8">
        <div className="text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4" style={{ wordBreak: 'break-word' }}>
            {data.productName || 'Product Name'}
          </h1>
          <p className="text-xl">{variant?.tagline || 'Creative Solutions for Modern Problems'}</p>
        </div>
      </div>

      {/* Body */}
      <div className="h-[177mm] bg-white p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{variant?.headline || 'What We Offer'}</h2>
        <p className="text-base text-gray-700 mb-8" style={{ wordBreak: 'break-word' }}>{description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 50)}
              </p>
            </div>
          ))}
        </div>

        {data.imageUrl && (
          <div className="w-full h-32 mb-6">
            <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}

        <div className="bg-purple-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{data.cta || 'Get Creative'}</h3>
          {data.website && <p className="text-sm">{data.website}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="h-[40mm] bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-700">
          {data.email && <p className="text-sm">{data.email}</p>}
          {data.phone && <p className="text-sm">{data.phone}</p>}
        </div>
      </div>
    </div>
  )
}

