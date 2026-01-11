'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnepager } from '@/contexts/OnepagerContext'

export function useKeyboardShortcuts() {
  const router = useRouter()
  const { state, setCurrentStep, setSelectedVariant } = useOnepager()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Save to My Works
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (state.selectedVariant) {
          // Trigger save functionality
          const saveButton = document.querySelector('[data-action="save"]') as HTMLButtonElement
          if (saveButton) {
            saveButton.click()
          }
        }
      }

      // Ctrl/Cmd + D: Download PDF
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        if (state.selectedVariant) {
          const downloadButton = document.querySelector('[data-action="download"]') as HTMLButtonElement
          if (downloadButton) {
            downloadButton.click()
          }
        }
      }

      // Ctrl/Cmd + N: Create new onepager
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        router.push('/home')
      }

      // Esc: Close modals/sidebar
      if (e.key === 'Escape') {
        const modal = document.querySelector('[data-modal]') as HTMLElement
        if (modal) {
          const closeButton = modal.querySelector('[data-close]') as HTMLButtonElement
          if (closeButton) {
            closeButton.click()
          }
        }
      }

      // Arrow keys for navigation (when applicable)
      if (e.key === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (state.currentStep > 1) {
          setCurrentStep(state.currentStep - 1)
        }
      }

      if (e.key === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        if (state.currentStep < 4) {
          setCurrentStep(state.currentStep + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, state, setCurrentStep, setSelectedVariant])
}

