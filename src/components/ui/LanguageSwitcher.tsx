'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/i18n'
import { useParams } from 'next/navigation'

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { locale: currentLocale } = useParams()

  const switchLocale = (newLocale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
    const cleanPath = pathWithoutLocale.replace(/^\/+/, '')
    const fullPath = `/${newLocale}/${cleanPath}`
    const normalizedPath = fullPath.replace(/\/+/g, '/')
    
    router.push(normalizedPath)
  }

  return (
    <select
      value={currentLocale as string}
      onChange={(e) => switchLocale(e.target.value as Locale)}
      className="border rounded-lg px-3 py-2 text-gray-700"
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {locale.toUpperCase()}
        </option>
      ))}
    </select>
  )
}