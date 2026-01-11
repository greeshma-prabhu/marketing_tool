/**
 * Text utility functions for content formatting and truncation
 */

export function truncateWords(text: string, maxWords: number): string {
  if (!text) return ''
  const words = text.split(' ')
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + '...'
}

export function truncateChars(text: string, maxChars: number): string {
  if (!text) return ''
  if (text.length <= maxChars) return text
  return text.substring(0, maxChars) + '...'
}

export function formatDescription(text: string, maxLength: number = 200): string {
  if (!text) return ''
  const cleaned = text.trim().replace(/\s+/g, ' ')
  if (cleaned.length <= maxLength) return cleaned
  return truncateChars(cleaned, maxLength)
}

export function formatFeature(feature: string, maxLength: number = 50): string {
  if (!feature) return ''
  const cleaned = feature.trim()
  if (cleaned.length <= maxLength) return cleaned
  return truncateChars(cleaned, maxLength)
}

export function splitIntoParagraphs(text: string, maxLength: number = 150): string[] {
  if (!text) return []
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs: string[] = []
  let current = ''
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (current.length + trimmed.length + 1 <= maxLength) {
      current += (current ? ' ' : '') + trimmed
    } else {
      if (current) paragraphs.push(current)
      current = trimmed
    }
  }
  if (current) paragraphs.push(current)
  
  return paragraphs.length > 0 ? paragraphs : [text]
}

