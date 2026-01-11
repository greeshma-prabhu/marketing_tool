'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function OrangeBlackTrifold({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white flex">
      {/* Left Panel - Orange */}
      <div className="w-1/3 bg-orange-500 p-6 flex flex-col justify-center text-white">
        <h1 className="text-4xl font-bold mb-4 text-center" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
        <div className="h-1 bg-white mb-4"></div>
        <p className="text-sm text-center" style={{ wordBreak: 'break-word' }}>{description}</p>
      </div>

      {/* Center Panel - Black */}
      <div className="w-1/3 bg-black p-6 flex flex-col justify-center text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">{variant?.headline || 'Features'}</h2>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="text-sm" style={{ wordBreak: 'break-word' }}>
              • {formatFeature(feature, 40)}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel - White */}
      <div className="w-1/3 bg-white p-6 flex flex-col justify-between">
        {data.imageUrl && (
          <div className="w-full h-32 mb-4">
            <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover rounded" />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold text-black mb-4">{data.cta || 'Get Started'}</h3>
          {data.website && <p className="text-sm text-gray-700">{data.website}</p>}
          {data.email && <p className="text-sm text-gray-700">{data.email}</p>}
          {data.phone && <p className="text-sm text-gray-700">{data.phone}</p>}
        </div>
      </div>
    </div>
  )
}

