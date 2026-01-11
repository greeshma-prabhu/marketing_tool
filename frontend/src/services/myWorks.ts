/**
 * Service for managing saved onepagers (My Works)
 */

export interface SavedWork {
  id: string
  productName: string
  template: string
  language: string
  date: string
  thumbnail: string // Base64 image or URL
  pdfUrl?: string // URL to PDF if available
  variantData?: any // Store variant data for regeneration
  productData?: any // Store product data
}

const STORAGE_KEY = 'myWorks'

export const myWorksService = {
  /**
   * Get all saved works
   */
  getAll(): SavedWork[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []
      return JSON.parse(stored)
    } catch (error) {
      console.error('Failed to load saved works:', error)
      return []
    }
  },

  /**
   * Save a new work
   */
  save(work: Omit<SavedWork, 'id' | 'date'>): SavedWork {
    const newWork: SavedWork = {
      ...work,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }

    const allWorks = this.getAll()
    allWorks.unshift(newWork) // Add to beginning
    this.saveAll(allWorks)
    
    return newWork
  },

  /**
   * Delete a work by ID
   */
  delete(id: string): boolean {
    const allWorks = this.getAll()
    const filtered = allWorks.filter(w => w.id !== id)
    this.saveAll(filtered)
    return filtered.length < allWorks.length
  },

  /**
   * Get a work by ID
   */
  getById(id: string): SavedWork | null {
    const allWorks = this.getAll()
    return allWorks.find(w => w.id === id) || null
  },

  /**
   * Save all works (internal)
   */
  saveAll(works: SavedWork[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
    } catch (error) {
      console.error('Failed to save works:', error)
    }
  },

  /**
   * Generate thumbnail from element
   */
  async generateThumbnail(element: HTMLElement): Promise<string> {
    const html2canvas = (await import('html2canvas')).default
    
    const canvas = await html2canvas(element, {
      scale: 0.3,
      useCORS: true,
      logging: false,
    })
    
    return canvas.toDataURL('image/png')
  },
}





