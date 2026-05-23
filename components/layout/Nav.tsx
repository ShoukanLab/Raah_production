'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MenuItem {
  label: string
  href: string
  number: string
}

const menuItems: MenuItem[] = [
  { label: 'Shows', href: '/#shows', number: '01' },
  { label: 'About', href: '/#about', number: '02' },
  { label: 'Contact', href: '/contact', number: '03' },
]

export function Nav() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleMenuItemClick = (href: string) => {
    setIsMenuOpen(false)
    if (href.startsWith('/#')) {
      const id = href.slice(2)
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    router.push(href)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-void/96 px-6 py-3.5 backdrop-blur-lg border-b border-charcoal">
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-start hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <div className="font-pinyon text-2xl text-white leading-none">Raah</div>
          <div className="font-montserrat text-xs font-bold tracking-widest uppercase text-gold">Production</div>
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center w-8 h-8 text-white hover:text-gold transition-colors"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 top-0 z-40 bg-void overflow-y-auto pt-20">
          <div className="px-6 py-8">
            {menuItems.map((item, index) => (
              <button
                key={item.href}
                onClick={() => handleMenuItemClick(item.href)}
                className="w-full py-8 border-b border-charcoal hover:opacity-80 transition-opacity text-left menu-item-enter"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <span className="font-playfair text-4xl text-white">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
