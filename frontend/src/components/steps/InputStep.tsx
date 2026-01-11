'use client'

import { useState } from 'react'
import { useOnepager } from '@/contexts/OnepagerContext'
import { useLanguage } from '@/contexts/LanguageContext'
import ManualInputTab from './tabs/ManualInputTab'
import CSVUploadTab from './tabs/CSVUploadTab'
import WebsiteScraperTab from './tabs/WebsiteScraperTab'

type TabType = 'manual' | 'csv' | 'website'

export default function InputStep() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>('manual')

  const tabs = [
    { id: 'manual' as TabType, labelKey: 'tab.manual', icon: '✏️' },
    { id: 'csv' as TabType, labelKey: 'tab.csv', icon: '📄' },
    { id: 'website' as TabType, labelKey: 'tab.website', icon: '🌐' },
  ]

  const getLabel = (key: string) => {
    const keyMap: Record<string, string> = {
      'tab.manual': 'inputPage.tab.manual',
      'tab.csv': 'inputPage.tab.csv',
      'tab.website': 'inputPage.tab.website',
    }
    return t(keyMap[key] || key)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('inputPage.title')}</h2>
        <p className="text-gray-600">{t('inputPage.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {getLabel(tab.labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'manual' && <ManualInputTab />}
        {activeTab === 'csv' && <CSVUploadTab />}
        {activeTab === 'website' && <WebsiteScraperTab />}
      </div>
    </div>
  )
}

