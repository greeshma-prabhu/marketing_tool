'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getImageSource, getLogoSource, getLanguageFont } from '@/utils/templateHelpers'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  data: ProductData
  variant?: Variant
}

export function BoldRed({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  const fontFamily = getLanguageFont(language)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily }} className="bg-white relative overflow-hidden">
      {/* Red Banner */}
      <div className="h-[80mm] bg-red-600 flex items-center justify-center">
        <h1 className="text-7xl font-bold text-white">BOLD</h1>
      </div>

      {/* White Box Overlay */}
      <div className="absolute top-16 left-8 right-8 bg-white shadow-2xl rounded-lg p-8 max-h-[180mm] overflow-hidden">
        <h2 className="text-4xl font-bold text-black mb-4 line-clamp-2" style={{ wordBreak: 'break-word' }}>
          {data.productName || t('template.productName')}
        </h2>
        <p className="text-base text-gray-700 mb-6 line-clamp-3" style={{ wordBreak: 'break-word' }}>{description}</p>
        <ul className="space-y-2 overflow-y-auto max-h-[100mm]">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <span className="text-red-600 mr-2 font-bold flex-shrink-0">•</span>
              <span className="text-sm text-black flex-1" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 60)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="mt-[120mm] p-8">
        <h3 className="text-2xl font-bold text-red-600 mb-4">{variant?.headline || t('template.getStarted')}</h3>
        <p className="text-base text-gray-700 line-clamp-2" style={{ wordBreak: 'break-word' }}>
          {variant?.tagline || data.cta || t('template.contactUs')}
        </p>
      </div>
    </div>
  )
}

