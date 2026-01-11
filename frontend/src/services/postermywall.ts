import axios from 'axios'
import { API_BASE_URL } from '@/config/api'

// Get API key from environment variable or use placeholder
const API_KEY = process.env.NEXT_PUBLIC_POSTERMYWALL_API_KEY || 'your_postermywall_api_key'
const API_URL = 'https://api.postermywall.com/v1'
const BACKEND_API_URL = API_BASE_URL || 'http://localhost:8000'

export interface PosterMyWallTemplate {
  id: string
  name: string
  description: string
  thumbnail_url?: string
  preview_url?: string
  category?: string
}

export interface PosterMyWallDesign {
  id: string
  design_id: string
  preview_url?: string
  download_url?: string
  status?: string
}

// Fallback custom template IDs
export const FALLBACK_TEMPLATE_IDS = [
  'ThreePanelVertical',
  'ModernGradient',
  'VibrantOrange',
  'TwoPanelHorizontal',
  'CorporateBlue',
  'ElegantPurple',
  'MinimalWhite',
  'BoldRed',
  'NatureGreen',
  'TechDark',
  'OrangeBlackTrifold',
  'TealYellowTrifold',
  'HealthNetwork',
  'VantageConstruction',
  'EdupathLearning',
  'CreativeSolutions',
]

export const posterMyWallService = {
  /**
   * Get templates from PosterMyWall API via backend proxy
   * Falls back to custom templates if API fails
   */
  async getTemplates(category: string = 'flyer', limit: number = 20): Promise<PosterMyWallTemplate[]> {
    const apiTemplates: PosterMyWallTemplate[] = []
    let lastError: any = null

    try {
      console.log('🔄 Fetching templates from PosterMyWall API via backend proxy...')
      
      // Call our backend proxy endpoint instead of PosterMyWall directly (bypasses CORS)
      const response = await axios.post(`${BACKEND_API_URL}/api/postermywall/templates`, {
        category: category,
        limit: limit
      }, {
        timeout: 5000, // 5 seconds max (backend has 2s timeout, so this is safe)
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.data && response.data.success && response.data.templates) {
        const templates = response.data.templates
        
        if (Array.isArray(templates) && templates.length > 0) {
          console.log(`✅ Found ${templates.length} templates from PosterMyWall API`)
          
          // Map PosterMyWall template format to our format
          const mapped = templates.map((template: any) => ({
            id: template.id || template.template_id || `pmw-${Date.now()}-${Math.random()}`,
            name: template.name || template.title || 'Untitled Template',
            description: template.description || '',
            thumbnail_url: template.thumbnail_url || template.thumbnail || template.preview_url,
            preview_url: template.preview_url || template.thumbnail_url,
            category: template.category || category,
          }))
          
          apiTemplates.push(...mapped)
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch templates from backend proxy:', error)
      lastError = error
    }

    // Always include fallback templates
    const fallbackTemplates: PosterMyWallTemplate[] = FALLBACK_TEMPLATE_IDS.map((id, index) => ({
      id,
      name: id.replace(/([A-Z])/g, ' $1').trim(),
      description: `Custom template: ${id}`,
      thumbnail_url: undefined,
      preview_url: undefined,
      category: 'custom',
    }))

    const allTemplates = [...apiTemplates, ...fallbackTemplates]

    if (apiTemplates.length === 0) {
      console.log(`⚠️ No templates found from API. Using ${fallbackTemplates.length} fallback templates.`)
      if (lastError) {
        console.log('Last API error:', lastError.message || lastError)
      }
    } else {
      console.log(`✅ Total templates: ${apiTemplates.length} API + ${fallbackTemplates.length} fallback = ${allTemplates.length}`)
    }

    return allTemplates
  },

  /**
   * Customize a template with user data
   */
  async customizeTemplate(
    templateId: string,
    productData: any,
    style: string = 'professional'
  ): Promise<PosterMyWallDesign> {
    try {
      // Truncate content for alignment
      const truncatedData = {
        ...productData,
        description: productData.description?.substring(0, 500) || '',
        features: productData.features?.slice(0, 6) || [],
      }

      // For custom templates, return a mock design
      if (FALLBACK_TEMPLATE_IDS.includes(templateId)) {
        return {
          id: `design-${Date.now()}-${Math.random()}`,
          design_id: `design-${Date.now()}-${Math.random()}`,
          preview_url: undefined,
          download_url: undefined,
          status: 'ready',
        }
      }

      // For PosterMyWall templates, try to customize via API
      // Note: This is a placeholder - actual PosterMyWall API may differ
      const response = await axios.post(
        `${API_URL}/designs`,
        {
          api_key: API_KEY,
          template_id: templateId,
          modifications: {
            text_fields: {
              title: truncatedData.productName || '',
              description: truncatedData.description || '',
              feature1: truncatedData.features?.[0] || '',
              feature2: truncatedData.features?.[1] || '',
              feature3: truncatedData.features?.[2] || '',
              feature4: truncatedData.features?.[3] || '',
            },
            images: truncatedData.imageUrl ? {
              main_image: truncatedData.imageUrl,
            } : {},
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      )

      return {
        id: response.data.id || response.data.design_id,
        design_id: response.data.design_id || response.data.id,
        preview_url: response.data.preview_url,
        download_url: response.data.download_url,
        status: response.data.status || 'processing',
      }
    } catch (error: any) {
      console.error('Failed to customize template:', error)
      // Return mock design for fallback
      return {
        id: `design-${Date.now()}-${Math.random()}`,
        design_id: `design-${Date.now()}-${Math.random()}`,
        preview_url: undefined,
        download_url: undefined,
        status: 'ready',
      }
    }
  },

  /**
   * Generate PDF from design
   */
  async generatePDF(designId: string): Promise<string> {
    try {
      const response = await axios.post(
        `${API_URL}/designs/${designId}/render`,
        {
          api_key: API_KEY,
          format: 'pdf',
          quality: 'high',
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )

      return response.data.download_url || response.data.url || ''
    } catch (error: any) {
      console.error('Failed to generate PDF:', error)
      throw new Error('Failed to generate PDF from PosterMyWall')
    }
  },

  /**
   * Get design status
   */
  async getDesignStatus(designId: string): Promise<string> {
    try {
      const response = await axios.get(
        `${API_URL}/designs/${designId}`,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
          timeout: 5000,
        }
      )

      return response.data.status || 'unknown'
    } catch (error: any) {
      console.error('Failed to get design status:', error)
      return 'ready' // Assume ready for fallback
    }
  },
}

