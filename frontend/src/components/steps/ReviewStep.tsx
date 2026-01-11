'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnepager } from '@/contexts/OnepagerContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/contexts/ToastContext'
import BackButton from '@/components/BackButton'
import TemplateRenderer from '../templates/TemplateRenderer'
import { posterMyWallService } from '@/services/postermywall'
import { myWorksService } from '@/services/myWorks'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, CheckCircle, Save, FileDown, Image as ImageIcon } from 'lucide-react'

export default function ReviewStep() {
  const { state, setCurrentStep, reset, startNewOnepager } = useOnepager()
  const { t, language } = useLanguage()
  const { showToast } = useToast()
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Validate workflow - redirect if previous steps not complete
  useEffect(() => {
    if (state.currentStep === 4) {
      if (!state.productData) {
        setCurrentStep(1)
        return
      }
      if (!state.selectedTemplate) {
        setCurrentStep(2)
        return
      }
      if (!state.selectedVariant && state.variants.length === 0) {
        setCurrentStep(3)
        return
      }
    }
  }, [state.currentStep, state.productData, state.selectedTemplate, state.selectedVariant, state.variants.length, setCurrentStep])

  const handleDownload = async (format: 'a4' | 'a5' = 'a4') => {
    if (!state.selectedVariant) return

    setDownloading(true)
    setDownloadSuccess(false)

    try {
      // Try PosterMyWall PDF download first if available
      if (state.selectedVariant.posterMyWallDesignId && format === 'a4') {
        try {
          const downloadUrl = await posterMyWallService.generatePDF(
            state.selectedVariant.posterMyWallDesignId
          )
          if (downloadUrl) {
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = `${state.productData?.productName || 'onepager'}-onepager.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            setDownloadSuccess(true)
            setDownloading(false)
            return
          }
        } catch (error) {
          console.warn('PosterMyWall PDF download failed, using client-side generation:', error)
        }
      }

      // Client-side PDF generation
      const element = document.getElementById('onepager-preview')
      if (!element) {
        throw new Error('Preview element not found')
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: format,
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      // Save PDF
      pdf.save(`${state.productData?.productName || 'onepager'}-onepager-${format.toUpperCase()}.pdf`)

      setDownloadSuccess(true)
      showToast(t('reviewPage.downloadSuccess'), 'success')
    } catch (error: any) {
      console.error('Download failed:', error)
      showToast(t('common.error'), 'error')
    } finally {
      setDownloading(false)
    }
  }

  // Auto-redirect after save success
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        startNewOnepager()
        router.push('/home')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess, startNewOnepager, router])

  const handleSave = async () => {
    if (!state.selectedVariant || !state.productData) {
      setSaveError(t('reviewPage.saveError'))
      return
    }

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const element = document.getElementById('onepager-preview')
      if (!element) {
        throw new Error('Preview element not found')
      }

      // Generate thumbnail
      const thumbnail = await myWorksService.generateThumbnail(element)

      // Get template name/label
      const templateId = state.selectedVariant.template || state.selectedTemplate || 'ThreePanelVertical'
      const templateName = getTemplateLabel(templateId)

      // Save to My Works
      myWorksService.save({
        productName: state.productData.productName || 'Onepager',
        template: templateId,
        language: language,
        thumbnail: thumbnail,
        variantData: state.selectedVariant,
        productData: state.productData,
      })

      setSaveSuccess(true)
      showToast(t('reviewPage.saveSuccess'), 'success')
    } catch (error: any) {
      console.error('Save failed:', error)
      const errorMsg = error.message || t('reviewPage.saveError')
      setSaveError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const getTemplateLabel = (templateId: string): string => {
    const templateLabels: Record<string, string> = {
      'ThreePanelVertical': 'Three Panel Vertical',
      'VibrantOrange': 'Vibrant Orange',
      'TealYellowTrifold': 'Teal Yellow Trifold',
      'HealthNetwork': 'Health Network',
      'VantageConstruction': 'Vantage Construction',
      'EdupathLearning': 'Edupath Learning',
      'CreativeSolutions': 'Creative Solutions',
      'OrangeBlackTrifold': 'Orange Black Trifold',
    }
    return templateLabels[templateId] || templateId
  }

  const handleDownloadA4 = async () => {
    await handleDownload('a4')
  }

  const handleDownloadA5 = async () => {
    await handleDownload('a5')
  }

  const handleDownloadPNG = async () => {
    if (!state.selectedVariant) return

    setDownloading(true)
    setDownloadSuccess(false)

    try {
      const element = document.getElementById('onepager-preview')
      if (!element) {
        throw new Error('Preview element not found')
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = imgData
      link.download = `${state.productData?.productName || 'onepager'}-onepager.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setDownloadSuccess(true)
    } catch (error: any) {
      console.error('PNG download failed:', error)
      alert(t('common.error'))
    } finally {
      setDownloading(false)
    }
  }

  const handleStartOver = () => {
    if (confirm(t('reviewPage.confirmStartOver'))) {
      reset()
      setCurrentStep(1)
    }
  }

  if (!state.selectedVariant) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20">
        <p className="text-gray-600 mb-4">{t('reviewPage.noVariant')}</p>
        <BackButton onClick={() => setCurrentStep(3)} label={t('reviewPage.backToVariants')} className="bg-indigo-600 text-white hover:bg-indigo-700" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('reviewPage.title')}</h2>
        <p className="text-gray-600">{t('reviewPage.subtitle')}</p>
      </div>

      {/* Success Toast Notification */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-slide-in">
          <CheckCircle className="h-6 w-6" />
          <div>
            <p className="font-semibold">{t('reviewPage.saveSuccess')}</p>
            <p className="text-sm text-green-100">{t('reviewPage.redirecting')}</p>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800 text-sm">{t('reviewPage.downloadSuccess')}</p>
        </div>
      )}

      {saveError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800 text-sm">{saveError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <div
          id="onepager-preview"
          className="mx-auto"
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            marginBottom: '-148.5mm',
          }}
        >
          {(() => {
            // Ensure templateId is always a string (never null/undefined)
            const templateId: string = state.selectedVariant.template || state.selectedTemplate || 'ThreePanelVertical'
            console.log('📄 ReviewStep rendering with template:', {
              variantTemplate: state.selectedVariant.template,
              selectedTemplate: state.selectedTemplate,
              usingTemplate: templateId
            })
            return (
              <TemplateRenderer
                templateId={templateId}
                data={state.selectedVariant.data}
                variant={state.selectedVariant}
              />
            )
          })()}
        </div>
      </div>

      {/* Save Button - Primary Action */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving || saveSuccess}
          className="flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>{t('reviewPage.saving')}</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-6 w-6" />
              <span>{t('reviewPage.savedToWorks')}</span>
            </>
          ) : (
            <>
              <Save className="h-6 w-6" />
              <span>{t('reviewPage.saveToWorks')}</span>
            </>
          )}
        </button>
      </div>

      {/* Download Buttons */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('reviewPage.downloadOptions')}</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownloadA4}
            disabled={downloading}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="h-5 w-5" />
            <span>{t('reviewPage.downloadA4')}</span>
          </button>
          <button
            onClick={handleDownloadA5}
            disabled={downloading}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="h-5 w-5" />
            <span>{t('reviewPage.downloadA5')}</span>
          </button>
          <button
            onClick={handleDownloadPNG}
            disabled={downloading}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImageIcon className="h-5 w-5" />
            <span>{t('reviewPage.downloadPNG')}</span>
          </button>
        </div>
        {downloading && (
          <div className="mt-4 flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            <span className="text-sm">{t('reviewPage.downloading')}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <BackButton onClick={() => setCurrentStep(3)} label={t('reviewPage.backToVariants')} />

        <button
          onClick={handleStartOver}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('reviewPage.startOver')}
        </button>
      </div>
    </div>
  )
}

