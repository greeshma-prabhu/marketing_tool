'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function EdupathLearning({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white">
      {/* Header - Blue */}
      <div className="h-[60mm] bg-blue-600 p-8 text-white">
        <h1 className="text-4xl font-bold mb-2" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
        <p className="text-lg">{variant?.tagline || description}</p>
      </div>

      {/* Body */}
      <div className="h-[197mm] bg-white p-8">
        <div className="grid grid-cols-2 gap-6 mb-8">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(i)
            return (
              <div key={i} className="bg-blue-50 rounded-lg p-6">
                <Icon className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Feature {i + 1}</h3>
                <p className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                  {formatFeature(feature, 60)}
                </p>
              </div>
            )
          })}
        </div>
        <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{data.cta || 'Start Learning Today'}</h3>
          <p className="text-sm">{variant?.tagline || 'Join thousands of learners'}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[40mm] bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-700">
          {data.website && <p className="text-sm">{data.website}</p>}
          {data.email && <p className="text-sm">{data.email}</p>}
        </div>
      </div>
    </div>
  )
}

