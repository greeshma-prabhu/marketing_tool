import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OnepagerProvider } from '@/contexts/OnepagerContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Onepager Generator',
  description: 'AI-powered onepager and brochure generation tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <SidebarProvider>
              <OnepagerProvider>
                {children}
              </OnepagerProvider>
            </SidebarProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

