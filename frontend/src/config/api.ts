/**
 * API Configuration
 * Centralized API base URL configuration
 */

export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' ? '' : 'http://localhost:8000')

// Helper function to get full API URL
export const getApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_BASE_URL}/${cleanPath}`
}

