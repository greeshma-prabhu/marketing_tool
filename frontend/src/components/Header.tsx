'use client'

import { Menu } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSidebar } from '@/contexts/SidebarContext'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { t } = useLanguage()
  const { toggleSidebar, isCollapsed } = useSidebar()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            {/* Hamburger Menu Button (Desktop) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            <h1 className="ml-2 text-xl font-bold text-gray-900 lg:ml-0">
              {t('app.title')}
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}

