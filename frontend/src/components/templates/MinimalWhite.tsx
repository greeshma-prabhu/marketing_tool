'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function MinimalWhite({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 150)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'Inter, sans-serif' }} className="bg-white flex flex-col items-center justify-center p-16">
      <h1 className="text-3xl font-light text-gray-900 mb-8 text-center" style={{ wordBreak: 'break-word' }}>
        {data.productName || 'Product Name'}
      </h1>
      <div className="w-24 h-0.5 bg-gray-300 mb-8"></div>
      <div className="flex gap-8 mb-12">
        {features.map((_, i) => {
          const Icon = getFeatureIcon(i)
          return <Icon key={i} className="h-6 w-6 text-gray-400" />
        })}
      </div>
      <p className="text-xs text-gray-500 text-center max-w-md mb-12" style={{ wordBreak: 'break-word' }}>
        {description}
      </p>
      {data.imageUrl && (
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img src={data.imageUrl} alt="Product" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}

