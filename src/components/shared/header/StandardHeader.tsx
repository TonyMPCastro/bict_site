'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { HeaderConfig, SocialLinkConfig } from '@/types/cms'
import { SocialLinks } from '../SocialLinks'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useRouter } from 'next/navigation'

export const StandardHeader = ({
  config,
  socialLinks = []
}: {
  config: HeaderConfig
  socialLinks?: SocialLinkConfig[]
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header
      className={`${
        config.sticky ? 'sticky top-0 z-40' : 'relative'
      } w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-white font-black text-xl flex items-center justify-center shadow-md">
            B
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
              BICT
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              UFMA
            </span>
          </div>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {config.links.map((link) => (
            <div key={link.id} className="relative group">
              <Link
                href={link.url}
                target={link.novaAba ? '_blank' : '_self'}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary transition-colors py-2"
              >
                {link.label}
                {link.sublinks && link.sublinks.length > 0 && (
                  <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180" />
                )}
              </Link>
              
              {link.sublinks && link.sublinks.length > 0 && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 flex flex-col gap-1">
                    {link.sublinks.map((sub) => (
                      <Link
                        key={sub.id}
                        href={sub.url}
                        className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Direita: Busca + Social + Login */}
        <div className="hidden lg:flex items-center gap-4">
          {config.showSearch && (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 focus:w-56 transition-all text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-8 pr-4 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-400" />
            </form>
          )}

          <ThemeToggle />

          {config.showSocialLinks !== false && <SocialLinks links={socialLinks} />}

          <Link
            href="/login"
            className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full transition-all shadow-md shadow-primary/20"
          >
            Entrar
          </Link>
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-700 dark:text-slate-200 p-2"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3">
          {config.links.map((link) => (
            <div key={link.id}>
              <div className="flex items-center justify-between">
                <Link
                  href={link.url}
                  onClick={() => {
                    if (!link.sublinks?.length) setMobileOpen(false)
                  }}
                  className="flex-1 block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary py-2"
                >
                  {link.label}
                </Link>
                {link.sublinks && link.sublinks.length > 0 && (
                  <button
                    onClick={() => setOpenSubmenuId(openSubmenuId === link.id ? null : link.id)}
                    className="p-2 text-slate-500 hover:text-primary"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenuId === link.id ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              
              {link.sublinks && link.sublinks.length > 0 && openSubmenuId === link.id && (
                <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                  {link.sublinks.map((sub) => (
                    <Link
                      key={sub.id}
                      href={sub.url}
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary py-1.5"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {config.showSocialLinks !== false && <SocialLinks links={socialLinks} />}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-full"
            >
              Entrar
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
