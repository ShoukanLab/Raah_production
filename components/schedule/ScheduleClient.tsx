'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { EyebrowLabel } from '@/components/ui/EyebrowLabel'
import { WaveLine } from '@/components/ui/WaveLine'
import { EventRow } from '@/components/schedule/EventRow'
import type { Show, Genre } from '@/types/sanity'

const GENRES: Genre[] = ['Jazz', 'Electronic', 'Acoustic', 'Orchestral']
const NEW_THRESHOLD_MS = 14 * 24 * 60 * 60 * 1000

interface MonthGroup {
  key: string
  label: string
  shows: Show[]
}

interface ScheduleClientProps {
  upcomingShows: Show[]
  pastShows: Show[]
}

function groupShowsByMonth(shows: Show[]): MonthGroup[] {
  const map = new Map<string, Show[]>()

  for (const show of shows) {
    const d = new Date(show.date)
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth()
    const key = `${year}-${String(month + 1).padStart(2, '0')}`

    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(show)
  }

  return Array.from(map.entries()).map(([key, shows]) => {
    const [year, month] = key.split('-').map(Number)
    const d = new Date(Date.UTC(year, month - 1, 1))
    const label = d.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    return { key, label, shows }
  })
}

export function ScheduleClient({
  upcomingShows,
  pastShows,
}: ScheduleClientProps) {
  const [activeGenre, setActiveGenre] = useState<Genre | 'All'>('All')
  const nowMs = Date.now()

  const filteredUpcoming =
    activeGenre === 'All'
      ? upcomingShows
      : upcomingShows.filter((s) => s.genre === activeGenre)

  const monthGroups = groupShowsByMonth(filteredUpcoming)

  const genreCounts = {
    Jazz: upcomingShows.filter((s) => s.genre === 'Jazz').length,
    Electronic: upcomingShows.filter((s) => s.genre === 'Electronic').length,
    Acoustic: upcomingShows.filter((s) => s.genre === 'Acoustic').length,
    Orchestral: upcomingShows.filter((s) => s.genre === 'Orchestral').length,
  }

  return (
    <>
      {/* Page Header */}
      <section className="px-6 pt-10 pb-6">
        <EyebrowLabel>Full Calendar</EyebrowLabel>
        <h1 className="font-playfair text-4xl text-champagne mt-2 mb-1">
          Schedule
        </h1>
        <WaveLine className="w-16 mt-3" />
      </section>

      {/* Filter Pills */}
      <section className="px-6 py-6 border-b border-charcoal">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {/* All pill */}
            <button
              onClick={() => setActiveGenre('All')}
              className={cn(
                'font-montserrat text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border rounded-sm transition-colors',
                activeGenre === 'All'
                  ? 'bg-gold text-void border-gold'
                  : 'border-charcoal text-champagne/50 bg-transparent hover:border-gold/40'
              )}
            >
              All <span className="ml-1 opacity-70">{upcomingShows.length}</span>
            </button>

            {/* Genre pills */}
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={cn(
                  'font-montserrat text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border rounded-sm transition-colors',
                  activeGenre === genre
                    ? 'bg-gold text-void border-gold'
                    : 'border-charcoal text-champagne/50 bg-transparent hover:border-gold/40'
                )}
              >
                {genre}{' '}
                <span className="ml-1 opacity-70">{genreCounts[genre]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Shows - Grouped by Month */}
      {filteredUpcoming.length > 0 ? (
        <section className="px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {monthGroups.map((group) => (
              <div key={group.key}>
                {/* Month heading */}
                <div className="px-4 py-3 flex items-center gap-3">
                  <span className="font-montserrat text-[10px] font-semibold tracking-widest uppercase text-gold/60">
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-charcoal" />
                </div>

                {/* Event rows */}
                <div className="border border-charcoal rounded-sm overflow-hidden">
                  {group.shows.map((show) => {
                    const createdAt = new Date(show._createdAt).getTime()
                    const isNew =
                      nowMs - createdAt <= NEW_THRESHOLD_MS
                    return (
                      <EventRow
                        key={show._id}
                        show={show}
                        isPast={false}
                        isNew={isNew}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Empty state for filtered results */
        <section className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            {activeGenre === 'All' ? (
              <div className="text-center">
                <p className="font-montserrat text-sm text-champagne/40 tracking-widest uppercase">
                  No upcoming shows scheduled
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-montserrat text-sm text-champagne/40 mb-4">
                  No {activeGenre} shows scheduled
                </p>
                <button
                  onClick={() => setActiveGenre('All')}
                  className="font-montserrat text-xs text-gold/70 underline underline-offset-2 hover:text-gold transition-colors"
                >
                  View all shows
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Past Shows Section */}
      {pastShows.length > 0 && (
        <section
          className="px-6 py-8 opacity-40 pointer-events-none select-none"
          aria-label="Past Shows"
          aria-hidden="true"
        >
          <div className="max-w-2xl mx-auto">
            <div className="px-4 py-3 flex items-center gap-3">
              <span className="font-montserrat text-[10px] font-semibold tracking-widest uppercase text-gold/60">
                Past Shows
              </span>
              <div className="flex-1 h-px bg-charcoal" />
              <span className="font-montserrat text-[9px] text-gold/40">
                {pastShows.length}
              </span>
            </div>

            <div className="border border-charcoal rounded-sm overflow-hidden">
              {pastShows.map((show) => (
                <EventRow
                  key={show._id}
                  show={show}
                  isPast={true}
                  isNew={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
