'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function TwoPanelHorizontal({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white flex flex-col">
      {/* Top Panel - Blue */}
      <div className="h-1/2 bg-indigo-600 flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-5xl font-bold mb-6 text-center" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
        <div className="flex gap-4">
          {features.slice(0, 4).map((_, i) => {
            const Icon = getFeatureIcon(i)
            return <Icon key={i} className="h-8 w-8 text-white" />
          })}
        </div>
      </div>

      {/* Bottom Panel - White */}
      <div className="h-1/2 bg-white p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-black mb-4">{variant?.headline || 'Features'}</h2>
        <p className="text-base text-gray-700 mb-6" style={{ wordBreak: 'break-word' }}>{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 60)}
              </span>
            </li>
          ))}
        </ul>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold w-fit">
          {data.cta || 'Learn More'}
        </button>
      </div>
    </div>
  )
}

