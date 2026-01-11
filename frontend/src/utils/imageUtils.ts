import { ProductData } from '@/contexts/OnepagerContext'

/**
 * Get the image source, prioritizing base64 file over URL
 */
export function getImageSource(data: ProductData): string | undefined {
  return data.imageFile || data.imageUrl
}

/**
 * Get the logo source, prioritizing base64 file over URL
 */
export function getLogoSource(data: ProductData): string | undefined {
  return data.logoFile || data.logoUrl
}

