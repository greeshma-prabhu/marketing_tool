'use client'

import { useState } from 'react'
import { useOnepager, ProductData } from '@/contexts/OnepagerContext'
import { useLanguage } from '@/contexts/LanguageContext'
import FileUpload from '@/components/FileUpload'

export default function ManualInputTab() {
  const { setProductData, setCurrentStep } = useOnepager()
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Partial<ProductData>>({
    productName: '',
    description: '',
    features: [],
    imageUrl: '',
    imageFile: '',
    logoUrl: '',
    logoFile: '',
    website: '',
    email: '',
    phone: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
    campaignMessage: '',
    cta: '',
  })

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('socialMedia.')) {
      const socialField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }))
    } else if (field === 'features') {
      setFormData(prev => ({ ...prev, features: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const currentFeatures = formData.features || []
    const newFeatures = [...currentFeatures]
    
    // Ensure array is large enough
    while (newFeatures.length <= index) {
      newFeatures.push('')
    }
    
    newFeatures[index] = value
    handleChange('features', newFeatures)
  }

  const handleAddFeature = () => {
    const currentFeatures = formData.features || []
    if (currentFeatures.length < 6) {
      handleChange('features', [...currentFeatures, ''])
    }
  }

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = formData.features || []
    const newFeatures = currentFeatures.filter((_, i) => i !== index)
    handleChange('features', newFeatures)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Use imageFile/logoFile if available, otherwise fall back to imageUrl/logoUrl
    const imageSource = formData.imageFile || formData.imageUrl
    const logoSource = formData.logoFile || formData.logoUrl
    
    const productData: ProductData = {
      productName: formData.productName || '',
      description: formData.description || undefined,
      features: (formData.features || []).filter(f => f.trim() !== ''),
      imageUrl: imageSource,
      imageFile: formData.imageFile,
      logoUrl: logoSource,
      logoFile: formData.logoFile,
      website: formData.website,
      email: formData.email,
      phone: formData.phone,
      socialMedia: formData.socialMedia,
      campaignMessage: formData.campaignMessage,
      cta: formData.cta,
    }
    setProductData(productData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('inputPage.productNameRequired')}
        </label>
        <input
          type="text"
          required
          value={formData.productName}
          onChange={(e) => handleChange('productName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={t('inputPage.productNamePlaceholder')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('inputPage.description')} <span className="text-gray-500 text-xs">({t('common.optional')})</span>
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={t('inputPage.descriptionPlaceholder')}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('inputPage.descriptionHint')}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('inputPage.features')} <span className="text-gray-500 text-xs">({t('common.optional')})</span>
          </label>
          {(formData.features || []).length < 6 && (
            <button
              type="button"
              onClick={handleAddFeature}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              + {t('inputPage.addFeature')}
            </button>
          )}
        </div>
        {(formData.features || []).map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`${t('inputPage.featurePlaceholder')} ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveFeature(index)}
              className="px-3 py-2 text-gray-500 hover:text-red-600 transition-colors"
              title={t('inputPage.removeFeature')}
            >
              ×
            </button>
          </div>
        ))}
        {(formData.features || []).length === 0 && (
          <p className="text-sm text-gray-500 italic">
            {t('inputPage.noFeaturesHint')}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <FileUpload
          type="image"
          label={t('inputPage.uploadImage')}
          placeholder={t('inputPage.dragDropOrClick')}
          maxSizeMB={5}
          onFileSelect={(file, dataUrl) => {
            handleChange('imageFile', dataUrl || '')
            handleChange('imageUrl', '') // Clear URL if file is uploaded
          }}
          currentFile={formData.imageFile || formData.imageUrl}
        />
        
        <FileUpload
          type="logo"
          label={t('inputPage.uploadLogo')}
          placeholder={t('inputPage.dragDropOrClick')}
          maxSizeMB={2}
          onFileSelect={(file, dataUrl) => {
            handleChange('logoFile', dataUrl || '')
            handleChange('logoUrl', '') // Clear URL if file is uploaded
          }}
          currentFile={formData.logoFile || formData.logoUrl}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('inputPage.website')}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('inputPage.email')}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('inputPage.phone')}
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('inputPage.campaignMessage')}
        </label>
        <input
          type="text"
          value={formData.cta || formData.campaignMessage}
          onChange={(e) => {
            handleChange('cta', e.target.value)
            handleChange('campaignMessage', e.target.value)
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Get started today!"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
      >
        {t('inputPage.continueToTemplates')}
      </button>
    </form>
  )
}

