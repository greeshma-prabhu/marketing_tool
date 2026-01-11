'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function BoldRed({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white relative">
      {/* Red Banner */}
      <div className="h-[80mm] bg-red-600 flex items-center justify-center">
        <h1 className="text-7xl font-bold text-white">BOLD</h1>
      </div>

      {/* White Box Overlay */}
      <div className="absolute top-16 left-8 right-8 bg-white shadow-2xl rounded-lg p-8">
        <h2 className="text-4xl font-bold text-black mb-4" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h2>
        <p className="text-base text-gray-700 mb-6" style={{ wordBreak: 'break-word' }}>{description}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className="text-red-600 mr-2 font-bold">•</span>
              <span className="text-sm text-black" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 60)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="mt-[120mm] p-8">
        <h3 className="text-2xl font-bold text-red-600 mb-4">{variant?.headline || 'Get Started'}</h3>
        <p className="text-base text-gray-700" style={{ wordBreak: 'break-word' }}>
          {variant?.tagline || data.cta || 'Contact us today!'}
        </p>
      </div>
    </div>
  )
}

