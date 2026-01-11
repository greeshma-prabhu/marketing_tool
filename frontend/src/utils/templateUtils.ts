/**
 * Template utility functions for responsive styling
 */

export function getResponsiveStyles() {
  return {
    container: {
      width: '210mm',
      height: '297mm',
      margin: '0 auto',
      overflow: 'hidden' as const,
    },
    text: {
      wordBreak: 'break-word' as const,
      overflow: 'hidden' as const,
      textOverflow: 'ellipsis' as const,
    },
    image: {
      objectFit: 'cover' as const,
      width: '100%',
      height: '100%',
    },
  }
}

