'use client'

import { ProductData, Variant } from '@/contexts/OnepagerContext'
import { lazy, Suspense } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ThreePanelVertical } from './ThreePanelVertical'
import { ModernGradient } from './ModernGradient'
import { VibrantOrange } from './VibrantOrange'
import { TwoPanelHorizontal } from './TwoPanelHorizontal'
import { CorporateBlue } from './CorporateBlue'
import { ElegantPurple } from './ElegantPurple'
import { MinimalWhite } from './MinimalWhite'
import { BoldRed } from './BoldRed'
import { NatureGreen } from './NatureGreen'
import { TechDark } from './TechDark'
import { OrangeBlackTrifold } from './OrangeBlackTrifold'
import { TealYellowTrifold } from './TealYellowTrifold'
import { HealthNetwork } from './HealthNetwork'
import { VantageConstruction } from './VantageConstruction'
import { EdupathLearning } from './EdupathLearning'
import { CreativeSolutions } from './CreativeSolutions'

interface TemplateRendererProps {
  templateId: string
  data: ProductData
  variant?: Variant
}

export default function TemplateRenderer({ templateId, data, variant }: TemplateRendererProps) {
  const props = { data, variant }
  
  // Normalize template ID (trim and handle case sensitivity)
  const normalizedTemplateId = templateId?.trim() || ''
  
  console.log('🎨 TemplateRenderer called with:', {
    originalTemplateId: templateId,
    originalType: typeof templateId,
    normalizedTemplateId: normalizedTemplateId,
    normalizedLength: normalizedTemplateId.length,
    hasData: !!data,
    hasVariant: !!variant,
    productName: data?.productName
  })
  
  // CRITICAL: Log all available template cases for debugging
  const availableTemplates = [
    'ThreePanelVertical', 'ModernGradient', 'VibrantOrange', 'TwoPanelHorizontal',
    'CorporateBlue', 'ElegantPurple', 'MinimalWhite', 'BoldRed', 'NatureGreen',
    'TechDark', 'OrangeBlackTrifold', 'TealYellowTrifold', 'HealthNetwork',
    'VantageConstruction', 'EdupathLearning', 'CreativeSolutions'
  ]
  
  if (!availableTemplates.includes(normalizedTemplateId)) {
    console.error('❌ CRITICAL: Template ID not found in available templates!', {
      received: normalizedTemplateId,
      available: availableTemplates,
      match: availableTemplates.find(t => t.toLowerCase() === normalizedTemplateId.toLowerCase())
    })
  }

  switch (normalizedTemplateId) {
    case 'ThreePanelVertical':
      return <ThreePanelVertical {...props} />
    case 'ModernGradient':
      return <ModernGradient {...props} />
    case 'VibrantOrange':
      return <VibrantOrange {...props} />
    case 'TwoPanelHorizontal':
      return <TwoPanelHorizontal {...props} />
    case 'CorporateBlue':
      return <CorporateBlue {...props} />
    case 'ElegantPurple':
      return <ElegantPurple {...props} />
    case 'MinimalWhite':
      return <MinimalWhite {...props} />
    case 'BoldRed':
      return <BoldRed {...props} />
    case 'NatureGreen':
      return <NatureGreen {...props} />
    case 'TechDark':
      return <TechDark {...props} />
    case 'OrangeBlackTrifold':
      return <OrangeBlackTrifold {...props} />
    case 'TealYellowTrifold':
      return <TealYellowTrifold {...props} />
    case 'HealthNetwork':
      return <HealthNetwork {...props} />
    case 'VantageConstruction':
      return <VantageConstruction {...props} />
    case 'EdupathLearning':
      return <EdupathLearning {...props} />
    case 'CreativeSolutions':
      return <CreativeSolutions {...props} />
    default:
      console.warn('⚠️ Unknown template ID, using default ThreePanelVertical:', normalizedTemplateId, 'Original:', templateId)
      return <ThreePanelVertical {...props} />
  }
}

