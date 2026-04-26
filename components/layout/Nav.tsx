'use client'

import { useRouter } from 'next/navigation'

export function Nav() {
  const router = useRouter()

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-void/96 px-6 py-3.5 backdrop-blur-lg border-b border-charcoal">
      <div className="flex flex-col items-start">
        <div className="font-pinyon text-2xl text-white leading-none">Raah</div>
        <div className="text-xs font-bold tracking-widest uppercase text-gray-600">Production</div>
      </div>

      <button
        onClick={() => router.push('/contact')}
        className="text-xs font-bold tracking-wider uppercase border border-gold/35 px-4 py-2.5 rounded-sm text-gold hover:border-gold/50 transition-colors"
        aria-label="Contact"
      >
        Contact
      </button>
    </nav>
  )
}
