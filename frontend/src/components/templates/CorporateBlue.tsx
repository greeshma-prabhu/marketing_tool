'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function CorporateBlue({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 3)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white">
      {/* Header */}
      <div className="h-[60mm] bg-blue-900 flex items-center justify-between px-8">
        {data.logoUrl ? (
          <img src={data.logoUrl} alt="Logo" className="h-16 object-contain" />
        ) : (
          <div className="h-16 w-32 bg-white/20 rounded"></div>
        )}
        <h1 className="text-4xl font-bold text-white" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
      </div>

      {/* Body - 3 Columns */}
      <div className="h-[197mm] bg-white p-8 flex gap-6">
        <div className="w-1/3 flex items-center justify-center">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="Product" className="w-full h-48 rounded-full object-cover" />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200"></div>
          )}
        </div>
        <div className="w-1/3 flex flex-col justify-center">
          <p className="text-base text-gray-700 mb-4" style={{ wordBreak: 'break-word' }}>{description}</p>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                • {formatFeature(feature, 50)}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3 flex flex-col gap-4">
          {['100+', '50+', '24/7'].map((stat, i) => (
            <div key={i} className="bg-blue-100 p-4 rounded text-center">
              <div className="text-2xl font-bold text-blue-900">{stat}</div>
              <div className="text-sm text-blue-700">Clients</div>
            </div>
          ))}
        </div>
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

