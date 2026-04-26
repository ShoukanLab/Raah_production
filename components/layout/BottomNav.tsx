'use client'

import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'shows',
    label: 'Shows',
    href: '/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'schedule',
    label: 'Schedule',
    href: '/schedule',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const getIsActive = (href: string): boolean => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-charcoal bg-void/98 px-0 py-3 pb-7 flex justify-around items-stretch">
      {navItems.map((item) => {
        const isActive = getIsActive(item.href)

        return (
          <button
            key={item.id}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center gap-1.5 cursor-pointer"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={isActive ? 'text-gold' : 'text-gray-600'}>
              {item.icon}
            </div>
            <span className={`text-xs font-semibold tracking-tight uppercase ${isActive ? 'text-gold' : 'text-gray-700'}`}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
