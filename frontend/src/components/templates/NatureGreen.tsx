'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { Leaf, Sprout } from 'lucide-react'

interface Props {
  data: ProductData
  variant?: Variant
}

export function NatureGreen({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-green-50">
      {/* Green Header */}
      <div className="h-[40mm] bg-green-600 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
      </div>

      {/* Content Cards */}
      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Leaf className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-green-600">About</h2>
          </div>
          <p className="text-base text-gray-700" style={{ wordBreak: 'break-word' }}>{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4">
              <Sprout className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 50)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-green-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{variant?.headline || data.cta || 'Join Us'}</h3>
          <p className="text-sm">{variant?.tagline || 'Be part of something great'}</p>
        </div>
      </div>
    </div>
  )
}

