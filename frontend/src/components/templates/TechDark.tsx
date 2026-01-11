'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'
import { getImageSource, getLogoSource, getLanguageFont } from '@/utils/templateHelpers'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  data: ProductData
  variant?: Variant
}

export function TechDark({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  // Keep monospace for tech theme, but use language-specific fallback
  const fontFamily = language === 'zh' 
    ? 'Noto Sans SC, monospace'
    : language === 'nl'
    ? 'Inter, monospace'
    : 'monospace'

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily }} className="bg-slate-900 text-white p-8 overflow-hidden">
      <div className="h-1 bg-cyan-400 mb-8"></div>
      <h1 className="text-5xl font-bold mb-4 text-cyan-400 line-clamp-2" style={{ wordBreak: 'break-word' }}>
        {data.productName || t('template.productName')}
      </h1>
      <p className="text-base text-gray-300 mb-8 line-clamp-4" style={{ wordBreak: 'break-word' }}>{description}</p>
      
      <div className="grid grid-cols-2 gap-6 mb-8 overflow-y-auto max-h-[150mm]">
        {features.map((feature, i) => {
          const Icon = getFeatureIcon(i)
          return (
            <div key={i} className="border border-cyan-400 p-4">
              <Icon className="h-6 w-6 text-cyan-400 mb-2" />
              <p className="text-sm text-white line-clamp-3" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 50)}
              </p>
            </div>
          )
        })}
      </div>

      <div className="h-1 bg-cyan-400 mb-8"></div>
      <button className="bg-cyan-400 text-slate-900 px-8 py-3 rounded font-bold hover:bg-cyan-300 transition-colors" style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
        {data.cta || t('template.getStarted')}
      </button>
    </div>
  )
}

