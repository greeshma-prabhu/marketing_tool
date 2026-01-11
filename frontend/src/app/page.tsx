'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnepager } from '@/contexts/OnepagerContext'
import { useAuth } from '@/contexts/AuthContext'
import InputStep from '@/components/steps/InputStep'
import TemplateStep from '@/components/steps/TemplateStep'
import GenerationStep from '@/components/steps/GenerationStep'
import ReviewStep from '@/components/steps/ReviewStep'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const { state, setCurrentStep } = useOnepager()
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Handle step from URL query parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const stepParam = params.get('step')
      if (stepParam) {
        const step = parseInt(stepParam, 10)
        if (step >= 1 && step <= 4) {
          setCurrentStep(step)
        }
      }
    }
  }, [setCurrentStep])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <InputStep />
      case 2:
        return <TemplateStep />
      case 3:
        return <GenerationStep />
      case 4:
        return <ReviewStep />
      default:
        return <InputStep />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          {renderStep()}
        </main>
      </div>
    </div>
  )
}

