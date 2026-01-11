'use client'

import { useState, useEffect } from 'react'
import { useOnepager, Variant } from '@/contexts/OnepagerContext'
import { useLanguage } from '@/contexts/LanguageContext'
import BackButton from '@/components/BackButton'
import TemplateRenderer from '../templates/TemplateRenderer'
import { posterMyWallService } from '@/services/postermywall'
import { API_BASE_URL } from '@/config/api'
import { FALLBACK_TEMPLATE_IDS } from '@/services/postermywall'
import { cache } from '@/utils/cache'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function GenerationStep() {
  const { state, setVariants, setSelectedVariant, setCurrentStep, addVersion } = useOnepager()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [localVariants, setLocalVariants] = useState<Variant[]>([])
  
  // Use localVariants for display, fallback to state.variants
  const displayVariants = localVariants.length > 0 ? localVariants : (state.variants || [])

  // Validate workflow - redirect if previous steps not complete
  useEffect(() => {
    if (state.currentStep === 3) {
      if (!state.productData) {
        console.log('Missing productData, redirecting to step 1')
        setCurrentStep(1)
        return
      }
      if (!state.selectedTemplate) {
        console.log('Missing selectedTemplate, redirecting to step 2')
        setCurrentStep(2)
        return
      }
    }
  }, [state.currentStep, state.productData, state.selectedTemplate, setCurrentStep])

  useEffect(() => {
    // Only generate if we're on step 3 and have both productData and selectedTemplate
    if (state.currentStep === 3) {
      if (state.productData && state.selectedTemplate) {
        // Only generate if we don't have variants yet
        if (localVariants.length === 0 && state.variants.length === 0) {
          console.log('Step 3 reached, generating variants...', {
            hasProductData: !!state.productData,
            selectedTemplate: state.selectedTemplate,
            selectedTemplateType: typeof state.selectedTemplate,
            selectedTemplateLength: state.selectedTemplate?.length,
            selectedTemplateRaw: JSON.stringify(state.selectedTemplate)
          })
          setLoading(true)
          generateVariants()
        } else {
          // Use existing variants
          if (state.variants.length > 0 && localVariants.length === 0) {
            setLocalVariants(state.variants)
          }
          setLoading(false)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentStep, state.productData, state.selectedTemplate, state.variants.length, localVariants.length])

  const generateVariants = async () => {
    if (!state.productData || !state.selectedTemplate) {
      console.error('Missing productData or selectedTemplate:', { 
        productData: !!state.productData, 
        selectedTemplate: state.selectedTemplate 
      })
      setLoading(false)
      // Redirect back to template selection if template is missing
      if (!state.selectedTemplate) {
        setCurrentStep(2)
      } else if (!state.productData) {
        setCurrentStep(1)
      }
      return
    }

    // Check cache first
    const cacheKey = `variants-${state.selectedTemplate}-${state.productData.productName}`
    const cachedVariants = cache.get<Variant[]>(cacheKey)
    if (cachedVariants) {
      console.log('✅ Using cached variants')
      setLocalVariants(cachedVariants)
      setVariants(cachedVariants)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const productData = state.productData
      const templateId = state.selectedTemplate
      
      console.log('🚀 Starting variant generation:', {
        templateId: templateId,
        templateIdType: typeof templateId,
        templateIdLength: templateId?.length,
        productName: productData.productName,
        hasFeatures: (productData.features || []).length
      })
      
      // CRITICAL: Verify template ID matches expected format
      if (!templateId || typeof templateId !== 'string') {
        console.error('❌ CRITICAL: Invalid template ID type:', typeof templateId, templateId)
        alert(`Error: Invalid template selected. Please go back and select a template again.`)
        setCurrentStep(2)
        setLoading(false)
        return
      }

      // Check if it's a PosterMyWall template or custom template
      const isCustomTemplate = FALLBACK_TEMPLATE_IDS.includes(templateId)

      if (!isCustomTemplate) {
        // Try to use PosterMyWall API
        try {
          const styles = ['professional', 'creative', 'minimal']
          const variantPromises = styles.map(async (style, index) => {
            try {
              const design = await posterMyWallService.customizeTemplate(
                templateId,
                productData,
                style
              )

              return {
                id: `variant-${String.fromCharCode(65 + index)}`,
                headline: `${productData.productName}: ${style.charAt(0).toUpperCase() + style.slice(1)} Design`,
                tagline: `Delivering ${style} excellence`,
                template: templateId, // Ensure we use the selected template ID
                data: productData,
                accentColor: ['#4F46E5', '#10B981', '#8B5CF6'][index],
                layoutEmphasis: (['features', 'benefits', 'specs'] as const)[index],
                posterMyWallDesignId: design.id,
                previewUrl: design.preview_url,
              } as Variant & { posterMyWallDesignId: string; previewUrl?: string }
            } catch (error) {
              console.error(`Failed to generate variant ${style}:`, error)
              return null
            }
          })

          const generatedVariants = await Promise.all(variantPromises)
          const validVariants = generatedVariants.filter(v => v !== null) as Variant[]

          if (validVariants.length > 0) {
            // Cache the variants
            cache.set(cacheKey, validVariants, 10 * 60 * 1000) // 10 minutes
            setLocalVariants(validVariants)
            setVariants(validVariants)
            addVersion(validVariants)
            setLoading(false)
            return
          }
        } catch (apiError) {
          console.error('PosterMyWall API failed, using fallback:', apiError)
        }
      }

      // Fallback: Generate variants using custom template renderer
      generateFallbackVariants()
    } catch (error) {
      console.error('Failed to generate variants:', error)
      generateFallbackVariants()
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackVariants = () => {
    if (!state.productData || !state.selectedTemplate) {
      console.error('Cannot generate fallback variants: missing data', {
        productData: !!state.productData,
        selectedTemplate: state.selectedTemplate
      })
      return
    }

    const productData = state.productData
    const { productName, features } = productData
    const selectedTemplateId = state.selectedTemplate

    console.log('🔧 Generating fallback variants:', {
      templateId: selectedTemplateId,
      templateIdRaw: JSON.stringify(selectedTemplateId),
      templateIdType: typeof selectedTemplateId,
      templateIdLength: selectedTemplateId?.length,
      productName: productName
    })
    
    // CRITICAL: Verify template ID is valid
    if (!selectedTemplateId || typeof selectedTemplateId !== 'string' || selectedTemplateId.trim() === '') {
      console.error('❌ CRITICAL: Invalid template ID:', {
        value: selectedTemplateId,
        type: typeof selectedTemplateId,
        trimmed: selectedTemplateId?.trim()
      })
      alert('Error: No template selected. Please go back and select a template.')
      setCurrentStep(2)
      setLoading(false)
      return
    }
    
    const cleanTemplateId = selectedTemplateId.trim()
    console.log('✅ Using clean template ID:', cleanTemplateId)

    const variants: Variant[] = [
      {
        id: 'variant-A',
        headline: `${productName}: Professional Excellence`,
        tagline: 'Delivering superior quality and reliability',
        template: cleanTemplateId, // Use the selected template - ensure it's trimmed
        data: { ...productData, features: [...(features || [])] },
        accentColor: '#4F46E5',
        layoutEmphasis: 'features',
      },
      {
        id: 'variant-B',
        headline: `${productName}: Creative Innovation`,
        tagline: 'Pushing boundaries with innovative solutions',
        template: cleanTemplateId, // Use the selected template - ensure it's trimmed
        data: { ...productData, features: [...(features || [])] },
        accentColor: '#10B981',
        layoutEmphasis: 'benefits',
      },
      {
        id: 'variant-C',
        headline: `${productName}: Minimal Elegance`,
        tagline: 'Simple, clean, and effective',
        template: cleanTemplateId, // Use the selected template - ensure it's trimmed
        data: { ...productData, features: [...(features || [])] },
        accentColor: '#8B5CF6',
        layoutEmphasis: 'specs',
      },
    ]

    // Cache the fallback variants
    cache.set(cacheKey, variants, 10 * 60 * 1000) // 10 minutes
    
    console.log('✅ Generated fallback variants:', {
      count: variants.length,
      selectedTemplate: cleanTemplateId,
      variantTemplates: variants.map(v => ({ id: v.id, template: v.template, matches: v.template === cleanTemplateId })),
      allMatch: variants.every(v => v.template === cleanTemplateId),
      firstVariantTemplate: variants[0]?.template
    })
    
    // CRITICAL CHECK: Verify all variants use the correct template
    const mismatched = variants.filter(v => v.template !== cleanTemplateId)
    if (mismatched.length > 0) {
      console.error('❌ CRITICAL ERROR: Some variants have wrong template ID!', {
        expected: cleanTemplateId,
        mismatched: mismatched.map(v => ({ id: v.id, template: v.template }))
      })
      alert('Error: Template mismatch detected. Please try again.')
      setLoading(false)
      return
    }
    
    setLocalVariants(variants)
    setVariants(variants)
    addVersion(variants)
    setLoading(false)
  }

  const handleSelectVariant = (variant: Variant) => {
    console.log('Variant selected:', variant.id)
    setSelectedVariant(variant)
    // Only move to step 4 after variant is selected
    setCurrentStep(4)
  }

  if (!state.productData || !state.selectedTemplate) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Missing Information</h3>
            <p className="text-sm text-yellow-700 mb-4">
              {!state.productData && !state.selectedTemplate
                ? 'Please provide product data and select a template first.'
                : !state.productData
                ? 'Please provide product data first.'
                : 'Please select a template first.'}
            </p>
            <button
              onClick={() => setCurrentStep(!state.productData ? 1 : 2)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">{t('generatePage.loading')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('generatePage.loadingSubtitle')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('generatePage.title')}</h2>
        <p className="text-gray-600">{t('generatePage.subtitle')}</p>
        {state.selectedTemplate && (
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>🔍 {t('generatePage.selectedTemplate')}:</strong> <code className="bg-indigo-100 px-2 py-1 rounded font-mono">{state.selectedTemplate}</code>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayVariants.length > 0 ? (
          displayVariants.map((variant, index) => (
            <div
              key={variant.id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="bg-indigo-600 text-white px-4 py-2">
                <span className="font-semibold">{t('generatePage.variant')} {String.fromCharCode(65 + index)}</span>
              </div>

              {/* Preview */}
              <div className="p-4 bg-gray-50" style={{ height: '400px', overflow: 'auto', position: 'relative' }}>
                {variant.previewUrl ? (
                  <img
                    src={variant.previewUrl}
                    alt={`Variant ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white border border-gray-200 rounded" style={{ position: 'relative', overflow: 'auto' }}>
                      {(() => {
                        const templateToUse = variant.template || state.selectedTemplate
                        
                        console.log(`🎨 Rendering variant ${variant.id}:`, {
                          variantTemplate: variant.template,
                          variantTemplateType: typeof variant.template,
                          selectedTemplate: state.selectedTemplate,
                          selectedTemplateType: typeof state.selectedTemplate,
                          usingTemplate: templateToUse,
                          usingTemplateType: typeof templateToUse,
                          templatesMatch: variant.template === state.selectedTemplate
                        })
                        
                        if (!templateToUse) {
                          console.error('❌ No template ID found for variant!', {
                            variant: variant.id,
                            variantTemplate: variant.template,
                            selectedTemplate: state.selectedTemplate
                          })
                          return <div className="text-red-500 p-4">Error: No template selected</div>
                        }
                        
                        // CRITICAL: Use the variant's template, not the selected template
                        const finalTemplateId = variant.template || state.selectedTemplate
                        console.log(`✅ Using template ID for variant ${variant.id}:`, finalTemplateId)
                        
                        return (
                          <div style={{ 
                            transform: 'scale(0.15)', 
                            transformOrigin: 'top left',
                            width: '666.67%',
                            height: '666.67%',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}>
                          <TemplateRenderer
                            templateId={finalTemplateId}
                            data={variant.data || state.productData}
                            variant={variant}
                          />
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{variant.headline}</h3>
                <p className="text-sm text-gray-600 mb-4">{variant.tagline}</p>
                <button
                  onClick={() => handleSelectVariant(variant)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {t('generatePage.select')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">{t('common.error')}</h3>
              <p className="text-sm text-yellow-700 mb-4">
                {loading 
                  ? t('generatePage.loading')
                  : t('common.error')}
              </p>
              {!loading && (
                <button
                  onClick={generateVariants}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {t('generatePage.regenerate')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <BackButton onClick={() => setCurrentStep(2)} />
        <button
          onClick={generateVariants}
          className="px-6 py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          🔄 {t('generatePage.regenerate')}
        </button>
      </div>
    </div>
  )
}

