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

export function ElegantPurple({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  const fontFamily = getLanguageFont(language)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily }} className="bg-white flex overflow-hidden">
      {/* Purple Sidebar */}
      <div className="w-[30%] bg-purple-600 p-8 flex flex-col justify-center overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-8">{t('template.features')}</h2>
        <div className="space-y-6 overflow-y-auto max-h-[200mm]">
          {features.map((feature, i) => {
            const Icon = getFeatureIcon(i)
            return (
              <div key={i} className="flex items-center text-white">
                <Icon className="h-6 w-6 mr-3 flex-shrink-0" />
                <span className="text-sm flex-1" style={{ wordBreak: 'break-word' }}>
                  {formatFeature(feature, 40)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-8 flex flex-col overflow-hidden">
        <div className="h-[40%] mb-6 flex-shrink-0">
          {imageSource ? (
            <img src={imageSource} alt="Product" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg"></div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 line-clamp-2" style={{ wordBreak: 'break-word' }}>
          {data.productName || t('template.productName')}
        </h1>
        <p className="text-base text-gray-700 mb-6 line-clamp-4" style={{ wordBreak: 'break-word' }}>{description}</p>
        <div className="mt-auto">
          <div className="h-1 bg-purple-600 mb-4"></div>
          <p className="text-sm text-gray-600">{variant?.tagline || data.cta || t('template.learnMore')}</p>
        </div>
      </div>
    </div>
  )
}

