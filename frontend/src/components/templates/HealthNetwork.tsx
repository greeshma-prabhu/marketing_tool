'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { Heart } from 'lucide-react'

interface Props {
  data: ProductData
  variant?: Variant
}

export function HealthNetwork({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white">
      {/* Header */}
      <div className="h-[60mm] bg-blue-600 flex items-center justify-between px-8">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white mr-3" />
          <h1 className="text-4xl font-bold text-white" style={{ wordBreak: 'break-word' }}>
            {data.productName || 'Product Name'}
          </h1>
        </div>
        {data.logoUrl && <img src={data.logoUrl} alt="Logo" className="h-12 object-contain" />}
      </div>

      {/* Body */}
      <div className="h-[197mm] bg-white p-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-base text-gray-700" style={{ wordBreak: 'break-word' }}>{description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Services</h2>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                  • {formatFeature(feature, 50)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {data.imageUrl && (
          <div className="w-full h-48 mb-8">
            <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover rounded-lg" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-[40mm] bg-blue-100 flex items-center justify-center">
        <div className="text-center text-gray-700">
          {data.website && <p className="text-sm">{data.website}</p>}
          {data.email && <p className="text-sm">{data.email}</p>}
          {data.phone && <p className="text-sm">{data.phone}</p>}
        </div>
      </div>
    </div>
  )
}

