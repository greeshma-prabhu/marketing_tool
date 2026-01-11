'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { Leaf, Sprout } from 'lucide-react'
import { getImageSource, getLogoSource, getLanguageFont } from '@/utils/templateHelpers'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  data: ProductData
  variant?: Variant
}

export function NatureGreen({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  const fontFamily = getLanguageFont(language)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily }} className="bg-green-50 overflow-hidden">
      {/* Green Header */}
      <div className="h-[40mm] bg-green-600 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white px-4 text-center" style={{ wordBreak: 'break-word', maxHeight: '40mm', overflow: 'hidden' }}>
          {data.productName || t('template.productName')}
        </h1>
      </div>

      {/* Content Cards */}
      <div className="p-8 space-y-6 overflow-y-auto max-h-[257mm]">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Leaf className="h-8 w-8 text-green-600 mr-3 flex-shrink-0" />
            <h2 className="text-2xl font-bold text-green-600">{t('template.about')}</h2>
          </div>
          <p className="text-base text-gray-700 line-clamp-4" style={{ wordBreak: 'break-word' }}>{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4">
              <Sprout className="h-6 w-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-700 line-clamp-3" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 50)}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-green-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{variant?.headline || data.cta || t('template.joinUs')}</h3>
          <p className="text-sm">{variant?.tagline || t('template.bePartOf')}</p>
        </div>
      </div>
    </div>
  )
}

