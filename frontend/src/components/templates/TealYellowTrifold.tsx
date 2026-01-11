'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function TealYellowTrifold({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white flex">
      {/* Left Panel - Teal */}
      <div className="w-1/3 bg-teal-500 p-6 flex flex-col justify-center text-white">
        <h1 className="text-4xl font-bold mb-6 text-center" style={{ wordBreak: 'break-word' }}>
          {data.productName || 'Product Name'}
        </h1>
        <p className="text-sm text-center" style={{ wordBreak: 'break-word' }}>{description}</p>
      </div>

      {/* Center Panel - Yellow */}
      <div className="w-1/3 bg-yellow-400 p-6 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">{variant?.headline || 'Key Features'}</h2>
        <div className="space-y-4">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(i)
            return (
              <div key={i} className="flex items-center">
                <Icon className="h-6 w-6 text-gray-900 mr-3" />
                <span className="text-sm text-gray-900" style={{ wordBreak: 'break-word' }}>
                  {formatFeature(feature, 40)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel - White */}
      <div className="w-1/3 bg-white p-6 flex flex-col justify-center">
        {data.logoUrl && (
          <div className="mb-6 flex justify-center">
            <img src={data.logoUrl} alt="Logo" className="h-24 object-contain" />
          </div>
        )}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{data.cta || 'Contact Us'}</h3>
          {data.website && <p className="text-sm text-gray-700">{data.website}</p>}
          {data.email && <p className="text-sm text-gray-700">{data.email}</p>}
          {data.phone && <p className="text-sm text-gray-700">{data.phone}</p>}
        </div>
      </div>
    </div>
  )
}

