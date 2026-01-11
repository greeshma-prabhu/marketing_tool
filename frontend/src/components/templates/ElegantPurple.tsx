'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function ElegantPurple({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white flex">
      {/* Purple Sidebar */}
      <div className="w-[30%] bg-purple-600 p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-white mb-8">Features</h2>
        <div className="space-y-6">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(i)
            return (
              <div key={i} className="flex items-center text-white">
                <Icon className="h-6 w-6 mr-3" />
                <span className="text-sm" style={{ wordBreak: 'break-word' }}>
                  {formatFeature(feature, 40)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="h-[40%] mb-6">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg"></div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
        <p className="text-base text-gray-700 mb-6" style={{ wordBreak: 'break-word' }}>{description}</p>
        <div className="mt-auto">
          <div className="h-1 bg-purple-600 mb-4"></div>
          <p className="text-sm text-gray-600">{variant?.tagline || data.cta || 'Learn More'}</p>
        </div>
      </div>
    </div>
  )
}

