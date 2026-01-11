'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface ProductData {
  productName: string
  description?: string
  features?: string[]
  imageUrl?: string
  imageFile?: string // base64 data URL
  logoUrl?: string
  logoFile?: string // base64 data URL
  website?: string
  email?: string
  phone?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  events?: string[]
  campaignMessage?: string
  cta?: string
}

export interface Variant {
  id: string
  headline: string
  tagline: string
  template: string
  data: ProductData
  accentColor?: string
  layoutEmphasis?: 'features' | 'benefits' | 'specs'
  posterMyWallDesignId?: string
  previewUrl?: string
}

interface OnepagerState {
  productData: ProductData | null
  selectedTemplate: string | null
  variants: Variant[]
  selectedVariant: Variant | null
  currentStep: number
  versions: Variant[][]
}

interface OnepagerContextType {
  state: OnepagerState
  setProductData: (data: ProductData) => void
  setSelectedTemplate: (templateId: string) => void
  setVariants: (variants: Variant[]) => void
  setSelectedVariant: (variant: Variant) => void
  setCurrentStep: (step: number) => void
  addVersion: (variants: Variant[]) => void
  reset: () => void
  startNewOnepager: () => void
  hasUnsavedWork: () => boolean
}

const initialState: OnepagerState = {
  productData: null,
  selectedTemplate: null,
  variants: [],
  selectedVariant: null,
  currentStep: 1,
  versions: [],
}

const OnepagerContext = createContext<OnepagerContextType | undefined>(undefined)

// Helper to optimize data for storage
function optimizeForStorage(data: any): any {
  if (!data) return null
  
  const optimized = { ...data }
  
  // Truncate long descriptions
  if (optimized.description && optimized.description.length > 500) {
    optimized.description = optimized.description.substring(0, 500) + '...'
  }
  
  // Limit features array
  if (Array.isArray(optimized.features)) {
    optimized.features = optimized.features.slice(0, 10)
  }
  
  // Exclude long image URLs from storage
  if (optimized.imageUrl && optimized.imageUrl.length > 200) {
    delete optimized.imageUrl
  }
  if (optimized.logoUrl && optimized.logoUrl.length > 200) {
    delete optimized.logoUrl
  }
  
  return optimized
}

export function OnepagerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnepagerState>(() => {
    // Try to load from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('onepagerState')
        if (stored) {
          const parsed = JSON.parse(stored)
          return { ...initialState, ...parsed }
        }
      } catch (error) {
        console.warn('Failed to load state from sessionStorage:', error)
      }
    }
    return initialState
  })

  // Save to sessionStorage with error handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const optimized = {
          ...state,
          productData: optimizeForStorage(state.productData),
          versions: state.versions.slice(-3), // Only keep last 3 versions
        }
        const serialized = JSON.stringify(optimized)
        
        // Check size before storing
        if (serialized.length > 500000) { // ~500KB limit
          console.warn('State too large for sessionStorage, skipping save')
          return
        }
        
        sessionStorage.setItem('onepagerState', serialized)
      } catch (error: any) {
        if (error.name === 'QuotaExceededError') {
          console.warn('SessionStorage quota exceeded, clearing old data')
          try {
            sessionStorage.removeItem('onepagerState')
            // Try again with minimal data
            const minimal = {
              currentStep: state.currentStep,
              selectedTemplate: state.selectedTemplate,
            }
            sessionStorage.setItem('onepagerState', JSON.stringify(minimal))
          } catch (e) {
            console.error('Failed to save minimal state:', e)
          }
        } else {
          console.error('Failed to save state:', error)
        }
      }
    }
  }, [state])

  const setProductData = (data: ProductData) => {
    setState(prev => ({ ...prev, productData: data, currentStep: 2 }))
  }

  const setSelectedTemplate = (templateId: string) => {
    console.log('💾 Storing template in context:', {
      templateId: templateId,
      type: typeof templateId,
      trimmed: templateId?.trim()
    })
    setState(prev => {
      const newState = { ...prev, selectedTemplate: templateId }
      console.log('💾 New state selectedTemplate:', newState.selectedTemplate)
      return newState
    })
    // Don't automatically move to step 3 - let user click Continue button
  }

  const setVariants = (variants: Variant[]) => {
    setState(prev => ({ ...prev, variants }))
    // Don't automatically move to step 4 - let user select a variant first
  }

  const setSelectedVariant = (variant: Variant) => {
    setState(prev => ({ ...prev, selectedVariant: variant }))
  }

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }))
  }

  const addVersion = (variants: Variant[]) => {
    setState(prev => ({
      ...prev,
      versions: [...prev.versions, variants],
    }))
  }

  const reset = () => {
    setState(initialState)
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('onepagerState')
        // Also clear any localStorage items
        localStorage.removeItem('productData')
        localStorage.removeItem('selectedTemplate')
        localStorage.removeItem('generatedVariants')
        localStorage.removeItem('selectedVariant')
        localStorage.removeItem('currentStep')
      } catch (error) {
        console.error('Failed to clear storage:', error)
      }
    }
  }

  const hasUnsavedWork = () => {
    return !!(
      state.productData ||
      state.selectedTemplate ||
      state.variants.length > 0 ||
      state.selectedVariant
    )
  }

  const startNewOnepager = () => {
    // Clear all state
    setState(initialState)
    
    if (typeof window !== 'undefined') {
      try {
        // Clear sessionStorage
        sessionStorage.removeItem('onepagerState')
        
        // Clear localStorage
        localStorage.removeItem('productData')
        localStorage.removeItem('selectedTemplate')
        localStorage.removeItem('generatedVariants')
        localStorage.removeItem('selectedVariant')
        localStorage.removeItem('currentStep')
      } catch (error) {
        console.error('Failed to clear storage:', error)
      }
    }
  }

  return (
    <OnepagerContext.Provider
      value={{
        state,
        setProductData,
        setSelectedTemplate,
        setVariants,
        setSelectedVariant,
        setCurrentStep,
        addVersion,
        reset,
        startNewOnepager,
        hasUnsavedWork,
      }}
    >
      {children}
    </OnepagerContext.Provider>
  )
}

export function useOnepager() {
  const context = useContext(OnepagerContext)
  if (!context) {
    throw new Error('useOnepager must be used within OnepagerProvider')
  }
  return context
}

