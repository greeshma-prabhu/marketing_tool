'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import TemplateRenderer from './templates/TemplateRenderer'

interface TemplatePreviewCardProps {
  templateId: string
}

// Mock data for preview
const mockData: ProductData = {
  productName: 'Sample Product',
  description: 'This is a sample product description that demonstrates the template layout and design.',
  features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  imageUrl: undefined,
  logoUrl: undefined,
}

const mockVariant: Variant = {
  id: 'preview',
  headline: 'Sample Product',
  tagline: 'Sample Tagline',
  template: '',
  data: mockData,
}

export default function TemplatePreviewCard({ templateId }: TemplatePreviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-t-lg overflow-hidden" style={{ height: '250px' }}>
      <div
        className="bg-gray-50"
        style={{
          transform: 'scale(0.12)',
          transformOrigin: 'top left',
          width: '833.33%',
          height: '833.33%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '210mm', height: '297mm', position: 'relative' }}>
          <TemplateRenderer
            templateId={templateId}
            data={mockData}
            variant={{ ...mockVariant, template: templateId }}
          />
        </div>
      </div>
    </div>
  )
}

