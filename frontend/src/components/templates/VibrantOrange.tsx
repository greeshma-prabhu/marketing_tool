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

export function VibrantOrange({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 3)
  const description = formatDescription(data.description || '', 250)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  const fontFamily = getLanguageFont(language)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily }} className="bg-white">
      {/* Top - Orange Gradient */}
      <div className="h-[100mm] bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center p-8">
        <h1 className="text-5xl font-bold text-white text-center" style={{ wordBreak: 'break-word' }}>
          {data.productName || t('template.productName')}
        </h1>
      </div>

      {/* Middle - White Cards */}
      <div className="h-[120mm] bg-white p-8">
        <div className="grid grid-cols-3 gap-6 h-full">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(i)
            return (
              <div key={i} className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center">
                <Icon className="h-12 w-12 text-orange-500 mb-4" />
                <h3 className="text-lg font-bold text-black mb-2">Feature {i + 1}</h3>
                <p className="text-sm text-gray-600" style={{ wordBreak: 'break-word' }}>
                  {formatFeature(feature, 50)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom - Orange Footer */}
      <div className="h-[77mm] bg-orange-500 flex items-center justify-center p-8">
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{variant?.headline || data.cta || t('template.getStarted')}</h2>
          <p className="text-lg">{variant?.tagline || description}</p>
        </div>
      </div>
    </div>
  )
}

