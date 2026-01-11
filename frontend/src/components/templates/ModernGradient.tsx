'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function ModernGradient({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white">
      {/* Top Section - Gradient */}
      <div className="h-[120mm] bg-gradient-to-r from-pink-500 to-purple-500 flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-bold text-white mb-4 text-center" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
        <p className="text-xl text-white text-center">{variant?.tagline || description}</p>
      </div>

      {/* Bottom Section - Features */}
      <div className="h-[177mm] bg-white p-8">
        <h2 className="text-4xl font-bold text-black mb-4">{variant?.headline || data.productName}</h2>
        <p className="text-base text-gray-600 mb-8" style={{ wordBreak: 'break-word' }}>{description}</p>
        
        <div className="grid grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(i)
            return (
              <div key={i} className="bg-white shadow-lg rounded-xl p-6">
                <Icon className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="text-lg font-bold mb-2">Feature {i + 1}</h3>
                <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word' }}>
                  {formatFeature(feature, 60)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

