import { ProductData } from '@/contexts/OnepagerContext'
import { Language } from '@/contexts/LanguageContext'

/**
 * Get language-specific font family
 */
export function getLanguageFont(language: Language): string {
  switch (language) {
    case 'zh':
      return 'Noto Sans SC, PingFang SC, sans-serif'
    case 'nl':
      return 'Inter, Roboto, sans-serif'
    default:
      return 'Inter, sans-serif'
  }
}

/**
 * Get image source, prioritizing base64 file over URL
 */
export function getImageSource(data: ProductData): string | undefined {
  return data.imageFile || data.imageUrl
}

/**
 * Get logo source, prioritizing base64 file over URL
 */
export function getLogoSource(data: ProductData): string | undefined {
  return data.logoFile || data.logoUrl
}

