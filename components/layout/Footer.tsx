'use client'

import Link from 'next/link'
import { Mail, Phone, ArrowUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-onyx border-t border-[#222] px-6 pt-10 pb-6">
      {/* Brand Block */}
      <div className="mb-10">
        <h2 className="font-pinyon text-5xl text-gold mb-2">Raah</h2>
        <p className="font-montserrat text-[9px] font-bold tracking-[0.2em] uppercase text-gold mb-4">
          Production
        </p>
        <p className="font-playfair italic text-sm text-t2">
          Where sound travels — built for the way music is meant to be heard.
        </p>
      </div>

      {/* Quick Links */}
      <div className="mb-10">
        <h3 className="font-montserrat text-[9px] font-bold tracking-[0.2em] uppercase text-t4 mb-4">
          Quick Links
        </h3>
        <div className="space-y-3">
          <Link href="/" className="block font-montserrat text-sm text-champagne hover:text-gold transition-colors">
            Shows
          </Link>
          <Link href="/about" className="block font-montserrat text-sm text-champagne hover:text-gold transition-colors">
            About
          </Link>
          <Link href="/contact" className="block font-montserrat text-sm text-champagne hover:text-gold transition-colors">
            Contact
          </Link>
        </div>
      </div>

      {/* Connect */}
      <div className="mb-10">
        <h3 className="font-montserrat text-[9px] font-bold tracking-[0.2em] uppercase text-t4 mb-4">
          Connect
        </h3>
        <div className="space-y-3">
          <a
            href="mailto:raahprod@gmail.com"
            className="flex items-center gap-3 font-montserrat text-sm text-champagne hover:text-gold transition-colors"
          >
            <Mail size={18} />
            raahprod@gmail.com
          </a>
          <a
            href="tel:+18259659855"
            className="flex items-center gap-3 font-montserrat text-sm text-champagne hover:text-gold transition-colors"
          >
            <Phone size={18} />
            +1 (825) 965-9855
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 font-montserrat text-sm text-champagne hover:text-gold transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <circle cx="17.5" cy="6.5" r="1.5"></circle>
            </svg>
            Instagram
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 font-montserrat text-sm text-champagne hover:text-gold transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5"></path>
            </svg>
            X / Twitter
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#222] pt-6 flex items-end justify-between">
        <div className="space-y-1">
          <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-t3">
            © 2026 RAAH PRODUCTION
          </p>
          <p className="font-montserrat text-[10px] tracking-[0.15em] uppercase text-t3">
            POWERED BY RAAH PRODUCTION
          </p>
        </div>
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 border border-gold/40 rounded-full flex items-center justify-center text-gold hover:text-champagne hover:border-gold transition-colors"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </footer>
  )
}
