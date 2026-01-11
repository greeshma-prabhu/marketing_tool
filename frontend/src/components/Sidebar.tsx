'use client'

import { X, FileText, Layout, Sparkles, Download, ChevronDown, FolderOpen, LogOut, Home } from 'lucide-react'
import { useOnepager } from '@/contexts/OnepagerContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state, setCurrentStep } = useOnepager()
  const { t, language, setLanguage } = useLanguage()
  const { user, logout } = useAuth()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login')
    onClose()
  }

  const steps = [
    { number: 1, nameKey: 'sidebar.inputData', icon: FileText, step: 1 },
    { number: 2, nameKey: 'sidebar.chooseTemplate', icon: Layout, step: 2 },
    { number: 3, nameKey: 'sidebar.generate', icon: Sparkles, step: 3 },
    { number: 4, nameKey: 'sidebar.review', icon: Download, step: 4 },
  ]

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'G'
  }

  const getUserName = () => {
    return user?.name || 'Greeshma'
  }

  const getUserEmail = () => {
    return user?.email || 'prabhugreeshma413@gmail.com'
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out flex flex-col ${
          // Mobile: controlled by isOpen
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          // Desktop: if collapsed, hide completely; otherwise show full width
          isCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0 lg:w-64 lg:static lg:z-auto'
        }`}
      >
        {/* Logo/Header */}
        <div className={`border-b border-gray-200 ${isCollapsed ? 'p-4' : 'p-6'} relative`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">📄</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-gray-900">Onepager</h1>
                <p className="text-xs text-gray-500">Generator</p>
              </div>
            )}
          </div>
          {/* Close button - visible on all screens */}
          <button
            onClick={() => {
              onClose() // Close mobile sidebar
              // On desktop, also toggle collapse
              if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                toggleSidebar()
              }
            }}
            className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 z-10"
            title="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {/* Home Link */}
            <li>
              <Link
                href="/home"
                onClick={onClose}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/home' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={t('sidebar.home')}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1 text-left">{t('sidebar.home')}</span>}
              </Link>
            </li>

            {/* My Works Link */}
            <li>
              <Link
                href="/my-works"
                onClick={onClose}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                  pathname === '/my-works' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={t('sidebar.myWorks')}
              >
                <FolderOpen className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1 text-left">{t('sidebar.myWorks')}</span>}
              </Link>
            </li>

            {/* Step Navigation */}
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = state.currentStep === step.step
              const isCompleted = state.currentStep > step.step
              const isDisabled = step.step > state.currentStep && !isCompleted

              return (
                <li key={step.number}>
                  <button
                    onClick={() => {
                      if (!isDisabled) {
                        setCurrentStep(step.step)
                        onClose()
                      }
                    }}
                    disabled={isDisabled}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 font-semibold'
                        : isCompleted
                        ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={t(step.nameKey)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="flex-1 text-left">{t(step.nameKey)}</span>}
                    {!isCollapsed && isCompleted && (
                      <span className="text-green-500">✓</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Language Selector */}
        <div className={`border-t border-gray-200 ${isCollapsed ? 'px-2 py-3' : 'px-4 py-3'}`}>
          {!isCollapsed && (
            <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">
              {t('sidebar.language')}
            </label>
          )}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'zh' | 'nl')}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white ${isCollapsed ? 'text-center' : ''}`}
            title={t('sidebar.language')}
          >
            <option value="en">🇬🇧 {!isCollapsed && 'English'}</option>
            <option value="zh">🇨🇳 {!isCollapsed && '中文'}</option>
            <option value="nl">🇳🇱 {!isCollapsed && 'Nederlands'}</option>
          </select>
        </div>

        {/* User Profile */}
        <div className={`border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-3`}>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {getUserInitial()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{getUserName()}</p>
                <p className="text-xs text-gray-500 truncate">{getUserEmail()}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors`}
            title={t('sidebar.logout')}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>{t('sidebar.logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

