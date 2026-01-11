'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
  className?: string
}

export default function BackButton({ href, onClick, label, className = '' }: BackButtonProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const baseClassName = `inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${className || 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'}`

  if (href && !onClick) {
    return (
      <Link
        href={href}
        className={baseClassName}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>{label || t('button.back')}</span>
      </Link>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={baseClassName}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>{label || t('button.back')}</span>
    </button>
  )
}

