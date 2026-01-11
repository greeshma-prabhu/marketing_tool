'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { formatDescription, formatFeature } from '@/utils/textUtils'
import { getFeatureIcon } from '@/utils/iconUtils'
import { getImageSource, getLogoSource } from '@/utils/imageUtils'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  data: ProductData
  variant?: Variant
}

export function ThreePanelVertical({ data, variant }: Props) {
  const { t, language } = useLanguage()
  const features = (data.features || []).slice(0, 4)
  const description = formatDescription(data.description || '', 200)
  const imageSource = getImageSource(data)
  const logoSource = getLogoSource(data)
  
  // Language-specific font
  const fontFamily = language === 'zh' 
    ? 'Noto Sans SC, PingFang SC, sans-serif'
    : language === 'nl'
    ? 'Inter, Roboto, sans-serif'
    : 'Inter, sans-serif'

  return (
    <div
      style={{
        width: '210mm',
        height: '297mm',
        display: 'flex',
        fontFamily: fontFamily,
      }}
      className="bg-white"
    >
      {/* LEFT PANEL */}
      <div className="w-1/3 bg-[#F5E6D3] p-8 flex flex-col">
        <h2 className="text-2xl font-bold text-[#8B7355] mb-6">
          {t('template.keyFeatures')}
        </h2>
        {features.map((feature, i) => {
          const Icon = getFeatureIcon(i)
          return (
            <div key={i} className="flex items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-[#7DD3C0] flex items-center justify-center text-white font-bold text-xl mr-4 flex-shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm text-gray-800 leading-relaxed flex-1" style={{ wordBreak: 'break-word' }}>
                {formatFeature(feature, 50)}
              </p>
            </div>
          )
        })}
      </div>

      {/* CENTER PANEL */}
      <div className="w-1/3 bg-[#FFB6D9] flex flex-col items-center justify-center p-8">
        {logoSource ? (
          <img src={logoSource} alt="Logo" className="w-32 h-32 rounded-full mb-6 object-cover" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-white mb-6 flex items-center justify-center">
            <span className="text-4xl">🏢</span>
          </div>
        )}
        <h1 className="text-5xl font-bold text-white mb-3 text-center leading-tight" style={{ wordBreak: 'break-word' }}>
          {data.productName || t('template.productName')}
        </h1>
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">{t('template.getInvolved')}</h2>
        <div className="text-white text-center space-y-2 mb-8">
          {data.website && <p className="text-sm">{data.website}</p>}
          {data.email && <p className="text-sm">{data.email}</p>}
          {data.phone && <p className="text-sm">{data.phone}</p>}
        </div>
        <div className="flex gap-3">
          {data.socialMedia?.facebook && (
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">f</div>
          )}
          {data.socialMedia?.linkedin && (
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">in</div>
          )}
          {data.socialMedia?.twitter && (
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">𝕏</div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/3 bg-white flex flex-col justify-between p-8">
        <div className="w-full aspect-square rounded-full bg-[#7DD3C0] flex items-center justify-center mb-4">
          <div className="text-center text-white p-8">
            <h3 className="text-3xl font-bold mb-2" style={{ wordBreak: 'break-word' }}>
              {variant?.headline || data.cta || t('template.takeAction')}
            </h3>
            <p className="text-xl mt-2 underline">{variant?.tagline || data.campaignMessage || t('template.itMatters')}</p>
          </div>
        </div>
        {imageSource && (
          <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
            <img src={imageSource} alt="Product" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="w-40 h-40 mx-auto rounded-full bg-[#F5E6D3] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-700">{t('template.campaign')}</p>
            <p className="text-xs text-[#FFB6D9] font-bold mt-1" style={{ wordBreak: 'break-word' }}>
              {data.productName || 'Product'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

