'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function VantageConstruction({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white">
      {/* Header - Dark Gray */}
      <div className="h-[50mm] bg-gray-800 flex items-center px-8">
        <h1 className="text-4xl font-bold text-white" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
      </div>

      {/* Body */}
      <div className="h-[197mm] bg-white p-8">
        <div className="flex gap-8 mb-8">
          <div className="w-1/2">
            {data.imageUrl && (
              <img src={data.imageUrl} alt="Product" className="w-full h-64 object-cover rounded-lg" />
            )}
          </div>
          <div className="w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{variant?.headline || 'Overview'}</h2>
            <p className="text-base text-gray-700 mb-6" style={{ wordBreak: 'break-word' }}>{description}</p>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                  ✓ {formatFeature(feature, 50)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer - Orange */}
      <div className="h-[50mm] bg-orange-500 flex items-center justify-center text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{data.cta || 'Contact Us Today'}</h3>
          {data.phone && <p className="text-sm">{data.phone}</p>}
          {data.email && <p className="text-sm">{data.email}</p>}
        </div>
      </div>
    </div>
  )
}

