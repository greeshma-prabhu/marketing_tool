'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getImageSource, getLogoSource, getLanguageFont } from '@/utils/templateHelpers'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  data: ProductData
  variant?: Variant
}

export function CorporateBlue({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 3)
  const description = formatDescription(data.description || '', 200)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  const fontFamily = getLanguageFont(language)

  return (
    <div style={{ width: '210mm', height: '297mm', fontFamily }} className="bg-white overflow-hidden">
      {/* Header */}
      <div className="h-[60mm] bg-blue-900 flex items-center justify-between px-8">
        {logoSource ? (
          <img src={logoSource} alt="Logo" className="h-16 object-contain max-w-[200px]" />
        ) : (
          <div className="h-16 w-32 bg-white/20 rounded"></div>
        )}
        <h1 className="text-4xl font-bold text-white flex-1 text-right ml-4" style={{ wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {data.productName || t('template.productName')}
        </h1>
      </div>

      {/* Body - 3 Columns */}
      <div className="h-[197mm] bg-white p-8 flex gap-6 overflow-hidden">
        <div className="w-1/3 flex items-center justify-center flex-shrink-0">
          {imageSource ? (
            <img src={imageSource} alt="Product" className="w-full max-w-[200px] h-48 rounded-full object-cover" />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200"></div>
          )}
        </div>
        <div className="w-1/3 flex flex-col justify-center overflow-hidden">
          <p className="text-base text-gray-700 mb-4 line-clamp-6" style={{ wordBreak: 'break-word' }}>{description}</p>
          <ul className="space-y-2 overflow-y-auto max-h-[120px]">
            {features.map((feature, i) => (
              <li key={i} className="text-sm text-gray-700" style={{ wordBreak: 'break-word' }}>
                • {formatFeature(feature, 50)}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3 flex flex-col gap-4 flex-shrink-0">
          {['100+', '50+', '24/7'].map((stat, i) => (
            <div key={i} className="bg-blue-100 p-4 rounded text-center">
              <div className="text-2xl font-bold text-blue-900">{stat}</div>
              <div className="text-sm text-blue-700">{t('template.clients')}</div>
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

