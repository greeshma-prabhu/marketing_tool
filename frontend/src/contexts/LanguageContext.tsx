'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'zh' | 'nl'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Comprehensive translations for entire app
const translations: Record<Language, Record<string, string>> = {
  en: {
    // App & Sidebar
    'app.title': 'Onepager Generator',
    'sidebar.home': 'Home',
    'sidebar.inputData': 'Input Data',
    'sidebar.chooseTemplate': 'Choose Template',
    'sidebar.generate': 'Generate Variants',
    'sidebar.review': 'Review & Download',
    'sidebar.myWorks': 'My Works',
    'sidebar.language': 'Language',
    'sidebar.logout': 'Logout',
    
    // Home/Dashboard
    'home.welcome': 'Welcome back,',
    'home.subtitle': 'Manage your onepagers and create new ones',
    'home.createNew': 'Create New Onepager',
    'home.viewWorks': 'View My Works',
    'home.browseTemplates': 'Browse Templates',
    'home.recentActivity': 'Recent Activity',
    'home.statistics': 'Statistics',
    'home.totalCreated': 'Total Onepagers Created',
    'home.thisWeek': 'This Week',
    'home.thisMonth': 'This Month',
    
    // Input Page
    'inputPage.title': 'Input Your Product Data',
    'inputPage.subtitle': 'Enter your product information below',
    'inputPage.productName': 'Product Name',
    'inputPage.productNameRequired': 'Product Name *',
    'inputPage.productNamePlaceholder': 'Enter product name',
    'inputPage.description': 'Description',
    'inputPage.descriptionRequired': 'Description *',
    'inputPage.descriptionPlaceholder': 'Describe your product...',
    'inputPage.features': 'Features (up to 6)',
    'inputPage.featurePlaceholder': 'Feature',
    'inputPage.imageUrl': 'Image URL',
    'inputPage.logoUrl': 'Logo URL',
    'inputPage.website': 'Website',
    'inputPage.email': 'Email',
    'inputPage.phone': 'Phone',
    'inputPage.campaignMessage': 'Campaign Message / CTA',
    'inputPage.uploadImage': 'Upload Image',
    'inputPage.uploadLogo': 'Company Logo (Optional)',
    'inputPage.tab.manual': 'Manual Input',
    'inputPage.tab.csv': 'CSV Upload',
    'inputPage.tab.website': 'Website Scraper',
    'inputPage.continueToTemplates': 'Continue to Templates →',
    'inputPage.dragDropOrClick': 'Drag and drop or click to upload',
    'inputPage.selectFile': 'Select File',
    'inputPage.changeFile': 'Change File',
    'inputPage.removeFile': 'Remove',
    'inputPage.acceptedFormatsImage': 'Accepted: JPG, PNG, WebP (max {maxSize}MB)',
    'inputPage.acceptedFormatsLogo': 'Accepted: PNG, SVG (max {maxSize}MB, transparent recommended)',
    'inputPage.fileTooLarge': 'File is too large. Maximum size is {maxSize}MB.',
    'inputPage.invalidFileType': 'Invalid file type. Accepted formats: {type}',
    'inputPage.fileReadError': 'Error reading file. Please try again.',
    'inputPage.descriptionHint': 'Optional: If not provided, AI will generate a description from the product name',
    'inputPage.addFeature': 'Add Feature',
    'inputPage.removeFeature': 'Remove Feature',
    'inputPage.noFeaturesHint': 'No features added. Templates will adjust automatically.',
    'common.optional': 'Optional',
    
    // Template Page
    'templatePage.title': 'Choose Your Template',
    'templatePage.subtitle': 'Select a template that matches your style',
    'templatePage.select': 'Select',
    'templatePage.selected': 'Selected',
    'templatePage.continue': 'Continue to Generate Variants',
    'templatePage.loading': 'Loading templates...',
    'templatePage.error': 'Failed to load templates',
    
    // Generate Page
    'generatePage.title': 'Your Onepagers Are Ready!',
    'generatePage.subtitle': 'Select your favorite variant to proceed',
    'generatePage.variant': 'Variant',
    'generatePage.regenerate': 'Regenerate',
    'generatePage.select': 'Select',
    'generatePage.loading': 'Generating variants...',
    'generatePage.loadingSubtitle': 'This may take a few moments',
    'generatePage.selectedTemplate': 'Selected Template ID',
    
    // Review Page
    'reviewPage.title': 'Review & Download',
    'reviewPage.subtitle': 'Review your onepager and download the final PDF',
    'reviewPage.saveToWorks': 'Save to My Works',
    'reviewPage.saving': 'Saving...',
    'reviewPage.saveSuccess': '✓ Saved to My Works!',
    'reviewPage.saveError': 'Failed to save. Please try again.',
    'reviewPage.redirecting': 'Redirecting to home...',
    'reviewPage.downloadOptions': 'Download Options',
    'reviewPage.downloadPDF': 'Download PDF',
    'reviewPage.downloadA4': 'Download PDF (A4)',
    'reviewPage.downloadA5': 'Download PDF (A5)',
    'reviewPage.downloadPNG': 'Download PNG',
    'reviewPage.downloading': 'Downloading...',
    'reviewPage.downloadSuccess': 'PDF downloaded successfully!',
    'reviewPage.savedToWorks': 'Saved to My Works',
    'reviewPage.backToVariants': 'Back to Variants',
    'reviewPage.startOver': 'Start Over',
    'reviewPage.requestRevision': 'Request Revision',
    'reviewPage.noVariant': 'No variant selected. Please go back and select one.',
    'reviewPage.confirmStartOver': 'Are you sure you want to start over? All progress will be lost.',
    
    // My Works Page
    'myWorks.title': 'My Works',
    'myWorks.subtitle': 'Your saved onepagers',
    'myWorks.noWorks': 'No onepagers yet',
    'myWorks.noWorksDesc': 'Start creating your first onepager to see it here',
    'myWorks.createNew': 'Create New Onepager',
    'myWorks.delete': 'Delete',
    'myWorks.deleteConfirm': 'Are you sure you want to delete this onepager?',
    'myWorks.productName': 'Product',
    'myWorks.template': 'Template',
    'myWorks.date': 'Date',
    'myWorks.view': 'View',
    'myWorks.download': 'Download',
    
    // Buttons
    'button.continue': 'Continue',
    'button.back': 'Back',
    'button.generate': 'Generate',
    'button.download': 'Download',
    'button.save': 'Save',
    'button.delete': 'Delete',
    'button.cancel': 'Cancel',
    'button.confirm': 'Confirm',
    'button.close': 'Close',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.required': 'Required',
    
    // Template Text
    'template.keyFeatures': 'Key Features',
    'template.productName': 'Product Name',
    'template.getInvolved': 'Get Involved!',
    'template.takeAction': 'Take Action',
    'template.itMatters': 'It Matters',
    'template.campaign': 'Campaign',
    'template.about': 'About',
    'template.services': 'Services',
    'template.contact': 'Contact',
    'template.learnMore': 'Learn More',
    'template.whatWeOffer': 'What We Offer',
    'template.getCreative': 'Get Creative',
  },
  zh: {
    // App & Sidebar
    'app.title': '单页生成器',
    'sidebar.home': '首页',
    'sidebar.inputData': '输入数据',
    'sidebar.chooseTemplate': '选择模板',
    'sidebar.generate': '生成变体',
    'sidebar.review': '查看和下载',
    'sidebar.myWorks': '我的作品',
    'sidebar.language': '语言',
    'sidebar.logout': '退出登录',
    
    // Home/Dashboard
    'home.welcome': '欢迎回来，',
    'home.subtitle': '管理您的单页并创建新单页',
    'home.createNew': '创建新单页',
    'home.viewWorks': '查看我的作品',
    'home.browseTemplates': '浏览模板',
    'home.recentActivity': '最近活动',
    'home.statistics': '统计',
    'home.totalCreated': '已创建单页总数',
    'home.thisWeek': '本周',
    'home.thisMonth': '本月',
    
    // Input Page
    'inputPage.title': '输入产品数据',
    'inputPage.subtitle': '请在下方输入您的产品信息',
    'inputPage.productName': '产品名称',
    'inputPage.productNameRequired': '产品名称 *',
    'inputPage.productNamePlaceholder': '输入产品名称',
    'inputPage.description': '描述',
    'inputPage.descriptionRequired': '描述 *',
    'inputPage.descriptionPlaceholder': '描述您的产品...',
    'inputPage.features': '功能特点（最多6个）',
    'inputPage.featurePlaceholder': '功能',
    'inputPage.imageUrl': '图片链接',
    'inputPage.logoUrl': '标志链接',
    'inputPage.website': '网站',
    'inputPage.email': '邮箱',
    'inputPage.phone': '电话',
    'inputPage.campaignMessage': '活动信息 / 行动号召',
    'inputPage.uploadImage': '上传图片',
    'inputPage.uploadLogo': '公司标志（可选）',
    'inputPage.tab.manual': '手动输入',
    'inputPage.tab.csv': 'CSV上传',
    'inputPage.tab.website': '网站抓取',
    'inputPage.continueToTemplates': '继续选择模板 →',
    'inputPage.dragDropOrClick': '拖放或点击上传',
    'inputPage.selectFile': '选择文件',
    'inputPage.changeFile': '更改文件',
    'inputPage.removeFile': '删除',
    'inputPage.acceptedFormatsImage': '支持格式：JPG、PNG、WebP（最大 {maxSize}MB）',
    'inputPage.acceptedFormatsLogo': '支持格式：PNG、SVG（最大 {maxSize}MB，建议透明背景）',
    'inputPage.fileTooLarge': '文件太大。最大大小为 {maxSize}MB。',
    'inputPage.invalidFileType': '无效的文件类型。支持格式：{type}',
    'inputPage.fileReadError': '读取文件时出错。请重试。',
    'inputPage.descriptionHint': '可选：如果未提供，AI将根据产品名称生成描述',
    'inputPage.addFeature': '添加功能',
    'inputPage.removeFeature': '删除功能',
    'inputPage.noFeaturesHint': '未添加功能。模板将自动调整。',
    'common.optional': '可选',
    
    // Template Page
    'templatePage.title': '选择您的模板',
    'templatePage.subtitle': '选择符合您风格的模板',
    'templatePage.select': '选择',
    'templatePage.selected': '已选择',
    'templatePage.continue': '继续生成变体',
    'templatePage.loading': '正在加载模板...',
    'templatePage.error': '加载模板失败',
    
    // Generate Page
    'generatePage.title': '您的单页已准备就绪！',
    'generatePage.subtitle': '选择您喜欢的变体继续',
    'generatePage.variant': '变体',
    'generatePage.regenerate': '重新生成',
    'generatePage.select': '选择',
    'generatePage.loading': '正在生成变体...',
    'generatePage.loadingSubtitle': '这可能需要几分钟',
    'generatePage.selectedTemplate': '已选择的模板ID',
    
    // Review Page
    'reviewPage.title': '查看和下载',
    'reviewPage.subtitle': '查看您的单页并下载最终PDF',
    'reviewPage.saveToWorks': '保存到我的作品',
    'reviewPage.saving': '正在保存...',
    'reviewPage.saveSuccess': '✓ 已保存到我的作品！',
    'reviewPage.saveError': '保存失败。请重试。',
    'reviewPage.redirecting': '正在跳转到首页...',
    'reviewPage.downloadOptions': '下载选项',
    'reviewPage.downloadPDF': '下载PDF',
    'reviewPage.downloadA4': '下载PDF (A4)',
    'reviewPage.downloadA5': '下载PDF (A5)',
    'reviewPage.downloadPNG': '下载PNG',
    'reviewPage.downloading': '正在下载...',
    'reviewPage.downloadSuccess': 'PDF下载成功！',
    'reviewPage.savedToWorks': '已保存到我的作品',
    'reviewPage.backToVariants': '返回变体',
    'reviewPage.startOver': '重新开始',
    'reviewPage.requestRevision': '请求修订',
    'reviewPage.noVariant': '未选择变体。请返回并选择一个。',
    'reviewPage.confirmStartOver': '您确定要重新开始吗？所有进度将丢失。',
    
    // My Works Page
    'myWorks.title': '我的作品',
    'myWorks.subtitle': '您保存的单页',
    'myWorks.noWorks': '还没有单页',
    'myWorks.noWorksDesc': '开始创建您的第一个单页以在此处查看',
    'myWorks.createNew': '创建新单页',
    'myWorks.delete': '删除',
    'myWorks.deleteConfirm': '您确定要删除此单页吗？',
    'myWorks.productName': '产品',
    'myWorks.template': '模板',
    'myWorks.date': '日期',
    'myWorks.view': '查看',
    'myWorks.download': '下载',
    
    // Buttons
    'button.continue': '继续',
    'button.back': '返回',
    'button.generate': '生成',
    'button.download': '下载',
    'button.save': '保存',
    'button.delete': '删除',
    'button.cancel': '取消',
    'button.confirm': '确认',
    'button.close': '关闭',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.success': '成功',
    'common.required': '必填',
    
    // Template Text
    'template.keyFeatures': '主要特点',
    'template.productName': '产品名称',
    'template.getInvolved': '参与进来！',
    'template.takeAction': '采取行动',
    'template.itMatters': '这很重要',
    'template.campaign': '活动',
    'template.about': '关于',
    'template.services': '服务',
    'template.contact': '联系方式',
    'template.learnMore': '了解更多',
    'template.whatWeOffer': '我们提供的服务',
    'template.getCreative': '发挥创意',
  },
  nl: {
    // App & Sidebar
    'app.title': 'Onepager Generator',
    'sidebar.home': 'Home',
    'sidebar.inputData': 'Gegevens Invoeren',
    'sidebar.chooseTemplate': 'Sjabloon Kiezen',
    'sidebar.generate': 'Varianten Genereren',
    'sidebar.review': 'Bekijk en Download',
    'sidebar.myWorks': 'Mijn Werken',
    'sidebar.language': 'Taal',
    'sidebar.logout': 'Uitloggen',
    
    // Home/Dashboard
    'home.welcome': 'Welkom terug,',
    'home.subtitle': 'Beheer uw onepagers en maak nieuwe',
    'home.createNew': 'Nieuwe Onepager Maken',
    'home.viewWorks': 'Mijn Werken Bekijken',
    'home.browseTemplates': 'Sjablonen Bekijken',
    'home.recentActivity': 'Recente Activiteit',
    'home.statistics': 'Statistieken',
    'home.totalCreated': 'Totaal Gemaakte Onepagers',
    'home.thisWeek': 'Deze Week',
    'home.thisMonth': 'Deze Maand',
    
    // Input Page
    'inputPage.title': 'Voer Productgegevens In',
    'inputPage.subtitle': 'Voer hieronder uw productinformatie in',
    'inputPage.productName': 'Productnaam',
    'inputPage.productNameRequired': 'Productnaam *',
    'inputPage.productNamePlaceholder': 'Voer productnaam in',
    'inputPage.description': 'Beschrijving',
    'inputPage.descriptionRequired': 'Beschrijving *',
    'inputPage.descriptionPlaceholder': 'Beschrijf uw product...',
    'inputPage.features': 'Functies (maximaal 6)',
    'inputPage.featurePlaceholder': 'Functie',
    'inputPage.imageUrl': 'Afbeelding URL',
    'inputPage.logoUrl': 'Logo URL',
    'inputPage.website': 'Website',
    'inputPage.email': 'E-mail',
    'inputPage.phone': 'Telefoon',
    'inputPage.campaignMessage': 'Campagne Bericht / CTA',
    'inputPage.uploadImage': 'Afbeelding Uploaden',
    'inputPage.uploadLogo': 'Bedrijfslogo (Optioneel)',
    'inputPage.tab.manual': 'Handmatige Invoer',
    'inputPage.tab.csv': 'CSV Upload',
    'inputPage.tab.website': 'Website Scraper',
    'inputPage.continueToTemplates': 'Doorgaan naar Sjablonen →',
    'inputPage.dragDropOrClick': 'Sleep en zet neer of klik om te uploaden',
    'inputPage.selectFile': 'Bestand Selecteren',
    'inputPage.changeFile': 'Bestand Wijzigen',
    'inputPage.removeFile': 'Verwijderen',
    'inputPage.acceptedFormatsImage': 'Geaccepteerd: JPG, PNG, WebP (max {maxSize}MB)',
    'inputPage.acceptedFormatsLogo': 'Geaccepteerd: PNG, SVG (max {maxSize}MB, transparant aanbevolen)',
    'inputPage.fileTooLarge': 'Bestand is te groot. Maximale grootte is {maxSize}MB.',
    'inputPage.invalidFileType': 'Ongeldig bestandstype. Geaccepteerde formaten: {type}',
    'inputPage.fileReadError': 'Fout bij het lezen van bestand. Probeer het opnieuw.',
    'inputPage.descriptionHint': 'Optioneel: Indien niet opgegeven, genereert AI een beschrijving op basis van de productnaam',
    'inputPage.addFeature': 'Functie Toevoegen',
    'inputPage.removeFeature': 'Functie Verwijderen',
    'inputPage.noFeaturesHint': 'Geen functies toegevoegd. Sjablonen passen zich automatisch aan.',
    'common.optional': 'Optioneel',
    
    // Template Page
    'templatePage.title': 'Kies Uw Sjabloon',
    'templatePage.subtitle': 'Selecteer een sjabloon dat bij uw stijl past',
    'templatePage.select': 'Selecteren',
    'templatePage.selected': 'Geselecteerd',
    'templatePage.continue': 'Doorgaan naar Varianten Genereren',
    'templatePage.loading': 'Sjablonen laden...',
    'templatePage.error': 'Sjablonen laden mislukt',
    
    // Generate Page
    'generatePage.title': 'Uw Onepagers Zijn Klaar!',
    'generatePage.subtitle': 'Selecteer uw favoriete variant om door te gaan',
    'generatePage.variant': 'Variant',
    'generatePage.regenerate': 'Opnieuw Genereren',
    'generatePage.select': 'Selecteren',
    'generatePage.loading': 'Varianten genereren...',
    'generatePage.loadingSubtitle': 'Dit kan even duren',
    'generatePage.selectedTemplate': 'Geselecteerd Sjabloon ID',
    
    // Review Page
    'reviewPage.title': 'Bekijk en Download',
    'reviewPage.subtitle': 'Bekijk uw onepager en download de definitieve PDF',
    'reviewPage.saveToWorks': 'Opslaan in Mijn Werken',
    'reviewPage.saving': 'Opslaan...',
    'reviewPage.saveSuccess': '✓ Opgeslagen in Mijn Werken!',
    'reviewPage.saveError': 'Opslaan mislukt. Probeer het opnieuw.',
    'reviewPage.redirecting': 'Doorverwijzen naar startpagina...',
    'reviewPage.downloadOptions': 'Downloadopties',
    'reviewPage.downloadPDF': 'PDF Downloaden',
    'reviewPage.downloadA4': 'PDF Downloaden (A4)',
    'reviewPage.downloadA5': 'PDF Downloaden (A5)',
    'reviewPage.downloadPNG': 'PNG Downloaden',
    'reviewPage.downloading': 'Downloaden...',
    'reviewPage.downloadSuccess': 'PDF succesvol gedownload!',
    'reviewPage.savedToWorks': 'Opgeslagen in Mijn Werken',
    'reviewPage.backToVariants': 'Terug naar Varianten',
    'reviewPage.startOver': 'Opnieuw Beginnen',
    'reviewPage.requestRevision': 'Revisie Aanvragen',
    'reviewPage.noVariant': 'Geen variant geselecteerd. Ga terug en selecteer er een.',
    'reviewPage.confirmStartOver': 'Weet u zeker dat u opnieuw wilt beginnen? Alle voortgang gaat verloren.',
    
    // My Works Page
    'myWorks.title': 'Mijn Werken',
    'myWorks.subtitle': 'Uw opgeslagen onepagers',
    'myWorks.noWorks': 'Nog geen onepagers',
    'myWorks.noWorksDesc': 'Begin met het maken van uw eerste onepager om deze hier te zien',
    'myWorks.createNew': 'Nieuwe Onepager Maken',
    'myWorks.delete': 'Verwijderen',
    'myWorks.deleteConfirm': 'Weet u zeker dat u deze onepager wilt verwijderen?',
    'myWorks.productName': 'Product',
    'myWorks.template': 'Sjabloon',
    'myWorks.date': 'Datum',
    'myWorks.view': 'Bekijken',
    'myWorks.download': 'Downloaden',
    
    // Buttons
    'button.continue': 'Doorgaan',
    'button.back': 'Terug',
    'button.generate': 'Genereren',
    'button.download': 'Downloaden',
    'button.save': 'Opslaan',
    'button.delete': 'Verwijderen',
    'button.cancel': 'Annuleren',
    'button.confirm': 'Bevestigen',
    'button.close': 'Sluiten',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Er is een fout opgetreden',
    'common.success': 'Succes',
    'common.required': 'Verplicht',
    
    // Template Text
    'template.keyFeatures': 'Belangrijkste Kenmerken',
    'template.productName': 'Productnaam',
    'template.getInvolved': 'Doe Mee!',
    'template.takeAction': 'Onderneem Actie',
    'template.itMatters': 'Het Maakt Uit',
    'template.campaign': 'Campagne',
    'template.about': 'Over',
    'template.services': 'Diensten',
    'template.contact': 'Contact',
    'template.learnMore': 'Meer Weten',
    'template.whatWeOffer': 'Wat We Bieden',
    'template.getCreative': 'Word Creatief',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language')
      if (saved && (saved === 'en' || saved === 'zh' || saved === 'nl')) {
        return saved as Language
      }
    }
    return 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
