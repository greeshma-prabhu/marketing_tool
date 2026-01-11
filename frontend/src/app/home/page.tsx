'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useOnepager } from '@/contexts/OnepagerContext'
import BackButton from '@/components/BackButton'
import { myWorksService } from '@/services/myWorks'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { FileText, FolderOpen, Layout, Plus } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const { t } = useLanguage()
  const { startNewOnepager, hasUnsavedWork } = useOnepager()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [works, setWorks] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
  })

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
    const allWorks = myWorksService.getAll()
    setWorks(allWorks.slice(0, 5)) // Last 5

    // Calculate stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const thisWeek = allWorks.filter(w => new Date(w.date) >= weekAgo).length
    const thisMonth = allWorks.filter(w => new Date(w.date) >= monthAgo).length

    setStats({
      total: allWorks.length,
      thisWeek,
      thisMonth,
    })
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

  if (authLoading) {
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
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
          <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('home.welcome')} {user?.name || 'Greeshma'}!
          </h1>
          <p className="text-gray-600">{t('home.subtitle')}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={handleCreateNew}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left w-full"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('home.createNew')}</h3>
                <p className="text-sm text-gray-500">Start a new onepager</p>
              </div>
            </div>
          </button>

          <Link
            href="/my-works"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('home.viewWorks')}</h3>
                <p className="text-sm text-gray-500">View saved onepagers</p>
              </div>
            </div>
          </Link>

          <Link
            href="/?step=2"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Layout className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t('home.browseTemplates')}</h3>
                <p className="text-sm text-gray-500">Explore templates</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('home.totalCreated')}</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('home.thisWeek')}</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{t('home.thisMonth')}</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('home.recentActivity')}</h2>
          {works.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('myWorks.noWorksDesc')}</p>
          ) : (
            <div className="space-y-4">
              {works.map((work) => (
                <div
                  key={work.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {work.thumbnail ? (
                      <img
                        src={work.thumbnail}
                        alt={work.productName}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{work.productName}</h3>
                      <p className="text-sm text-gray-500">
                        {work.template} • {formatDate(work.date)}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/my-works"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  >
                    {t('myWorks.view')}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
          </div>
        </main>
      </div>
    </div>
  )
}

