'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'

interface Props {
  data: ProductData
  variant?: Variant
}

export function TechDark({ data, variant }: Props) {
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily: 'monospace' }} className="bg-slate-900 text-white p-8">
      <div className="h-1 bg-cyan-400 mb-8"></div>
      <h1 className="text-5xl font-bold mb-4 text-cyan-400" style={{ wordBreak: 'break-word' }}>
        {data.productName || 'Product Name'}
      </h1>
      <p className="text-base text-gray-300 mb-8" style={{ wordBreak: 'break-word' }}>{description}</p>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        {features.map((feature, i) => {
          const Icon = getFeatureIcon(i)
          return (
            <div key={i} className="border border-cyan-400 p-4">
              <Icon className="h-6 w-6 text-cyan-400 mb-2" />
              <p className="text-sm text-white" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 50)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="h-1 bg-cyan-400 mb-8"></div>
      <button className="bg-cyan-400 text-slate-900 px-8 py-3 rounded font-bold hover:bg-cyan-300 transition-colors" style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
        {data.cta || 'Get Started'}
      </button>
    </div>
  )
}

