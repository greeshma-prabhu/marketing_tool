'use client'

import { useState, useEffect } from 'react'
import { useOnepager } from '@/contexts/OnepagerContext'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import { posterMyWallService, FALLBACK_TEMPLATE_IDS } from '@/services/postermywall'
import TemplatePreviewCard from '@/components/TemplatePreviewCard'

// Map template IDs to single-word compact names
const getShortTemplateName = (templateId: string, fullName: string): string => {
  const shortNameMap: Record<string, string> = {
    'ThreePanelVertical': 'Trifold',
    'ModernGradient': 'Gradient',
    'VibrantOrange': 'Vibrant',
    'TwoPanelHorizontal': 'Bifold',
    'CorporateBlue': 'Corporate',
    'ElegantPurple': 'Elegant',
    'MinimalWhite': 'Minimal',
    'BoldRed': 'Bold',
    'NatureGreen': 'Nature',
    'TechDark': 'Tech',
    'OrangeBlackTrifold': 'Orange',
    'TealYellowTrifold': 'Teal',
    'HealthNetwork': 'Health',
    'VantageConstruction': 'Vantage',
    'EdupathLearning': 'Edupath',
    'CreativeSolutions': 'Creative',
  }
  
  // Check if we have a short name for this template ID
  if (shortNameMap[templateId]) {
    return shortNameMap[templateId]
  }
  
  // For API templates, use first word only (single word)
  const words = fullName.split(' ')
  return words[0] || fullName
}

export default function TemplateStep() {
  const { state, setSelectedTemplate, setCurrentStep } = useOnepager()
  const { t } = useLanguage()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedTemplates = await posterMyWallService.getTemplates('flyer', 20)
      setTemplates(fetchedTemplates)
      
      const apiTemplates = fetchedTemplates.filter(t => !FALLBACK_TEMPLATE_IDS.includes(t.id))
      const fallbackTemplates = fetchedTemplates.filter(t => FALLBACK_TEMPLATE_IDS.includes(t.id))
      
      console.log(`📦 Loaded ${fetchedTemplates.length} total templates`)
      console.log(`📊 Breakdown: ${apiTemplates.length} API templates, ${fallbackTemplates.length} fallback templates`)
      
      if (apiTemplates.length === 0) {
        console.log('⚠️ No PosterMyWall API templates found. Check browser console for API errors.')
      }
    } catch (err: any) {
      console.error('Failed to load templates:', err)
      setError(err.message || 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = (templateId: string) => {
    console.log('📌 Template selected:', {
      templateId: templateId,
      type: typeof templateId,
      length: templateId?.length,
      trimmed: templateId?.trim(),
      raw: JSON.stringify(templateId)
    })
    setSelectedTemplate(templateId)
    
    // Verify it was set correctly
    setTimeout(() => {
      console.log('✅ Template stored in state:', state.selectedTemplate)
    }, 100)
  }

  const handleContinue = () => {
    if (state.selectedTemplate && state.productData) {
      setCurrentStep(3)
    } else if (!state.productData) {
      alert('Please provide product data first')
      setCurrentStep(1)
    } else {
      alert('Please select a template first')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('templatePage.loading')}</p>
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="mb-6">
        <BackButton onClick={() => setCurrentStep(1)} />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{t('templatePage.title')}</h2>
            <p className="text-gray-600">{t('templatePage.subtitle')}</p>
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Step 2 of 4
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">{t('templatePage.error')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
        {templates.map((template) => {
          const shortName = getShortTemplateName(template.id, template.name)
          
          return (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className={`cursor-pointer transition-all bg-white rounded-lg border-2 overflow-hidden ${
                state.selectedTemplate === template.id
                  ? 'ring-2 ring-indigo-500 ring-offset-2 border-indigo-500'
                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
              style={{ width: '280px', height: '340px', maxWidth: '100%' }}
            >
              <TemplatePreviewCard templateId={template.id} />
              <div className="bg-white border-t border-gray-200 flex flex-col items-center justify-center" style={{ height: '90px', padding: '6px 8px' }}>
                <h3 
                  className="text-gray-900 font-semibold text-center"
                  style={{ 
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: '1.0',
                    maxWidth: '70px',
                    margin: '0 auto',
                    color: '#1F2937',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {shortName}
                </h3>
                <button
                  className={`py-1.5 px-2 rounded font-medium transition-colors ${
                    state.selectedTemplate === template.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ height: '32px', width: '80%', fontSize: '12px' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectTemplate(template.id)
                  }}
                >
                  {state.selectedTemplate === template.id ? t('templatePage.selected') : t('templatePage.select')}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('templatePage.error')}</p>
          <button
            onClick={loadTemplates}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {t('button.continue')}
          </button>
        </div>
      )}

      {state.selectedTemplate && templates.length > 0 && (
        <div className="mt-8 flex justify-between">
          <BackButton onClick={() => setCurrentStep(1)} />
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            {t('templatePage.continue')} →
          </button>
        </div>
      )}
    </div>
  )
}

