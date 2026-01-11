'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useOnepager } from '@/contexts/OnepagerContext'
import BackButton from '@/components/BackButton'
import { myWorksService, SavedWork } from '@/services/myWorks'
import { Trash2, Download, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import jsPDF from 'jspdf'

export default function MyWorksPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const { startNewOnepager, hasUnsavedWork } = useOnepager()
  const router = useRouter()
  const [works, setWorks] = useState<SavedWork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadWorks()
    }
  }, [isAuthenticated])

  const loadWorks = () => {
    setLoading(true)
    const savedWorks = myWorksService.getAll()
    setWorks(savedWorks)
    setLoading(false)
  }

  const handleDelete = (id: string) => {
    if (confirm(t('myWorks.deleteConfirm'))) {
      const success = myWorksService.delete(id)
      if (success) {
        loadWorks()
      }
    }
  }

  const handleDownload = async (work: SavedWork) => {
    try {
      if (work.pdfUrl) {
        // If PDF URL exists, download directly
        const link = document.createElement('a')
        link.href = work.pdfUrl
        link.download = `${work.productName}-onepager.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }

      // Otherwise, regenerate from variant data if available
      if (work.variantData) {
        // This would require re-rendering the template
        // For now, show a message
        alert('PDF regeneration from saved data is not yet implemented. Please regenerate from the main flow.')
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert(t('common.error'))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleCreateNew = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (hasUnsavedWork()) {
      if (confirm('You have unsaved work. Start new onepager?')) {
        startNewOnepager()
        router.push('/?step=1')
      }
    } else {
      startNewOnepager()
      router.push('/?step=1')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/home" />
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('myWorks.title')}</h1>
              <p className="text-gray-600 mt-2">{t('myWorks.subtitle')}</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>{t('myWorks.createNew')}</span>
            </button>
          </div>
        </div>

        {works.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('myWorks.noWorks')}</h3>
              <p className="text-gray-600 mb-6">{t('myWorks.noWorksDesc')}</p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>{t('myWorks.createNew')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] bg-gray-100 relative">
                  {work.thumbnail ? (
                    <img
                      src={work.thumbnail}
                      alt={work.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{work.productName}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('myWorks.template')}:</span>
                      <span className="font-medium">{work.template}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('myWorks.date')}:</span>
                      <span className="font-medium">{formatDate(work.date)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(work)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <Download className="h-4 w-4" />
                      <span>{t('myWorks.download')}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(work.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title={t('myWorks.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

