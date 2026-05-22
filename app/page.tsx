import { getFeaturedShow, getUpcomingShows, getPastShows } from '@/lib/sanity'
import { EyebrowLabel } from '@/components/ui/EyebrowLabel'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FeaturedShowCard, ShowCard } from '@/components/shows'
import { AboutContent } from '@/components/about/AboutContent'

export const metadata = {
  title: {
    absolute: 'Raah Production — Live Music & Events',
  },
}

export default async function HomePage() {
  const [featured, past] = await Promise.all([
    getFeaturedShow(),
    getPastShows(),
  ])

  return (
      <main className="bg-void pb-32">
        {/* Hero Section — description as gold-band banner */}
        <section className="relative px-6 pt-16 pb-20 overflow-hidden isolate">
          {/* Gold shimmer band background */}
          <div
              aria-hidden
              className="absolute inset-x-0 top-6 bottom-4 -z-10 bg-gradient-radial from-gold/60 via-gold/25 to-transparent"
          />
          {/* Fine horizontal striations for the metallic shimmer */}
          <div
              aria-hidden
              className="absolute inset-x-0 top-6 bottom-4 -z-10 mix-blend-overlay opacity-50"
              style={{
                backgroundImage:
                    'repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)',
              }}
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <EyebrowLabel>Raah Production · Live Music & Events</EyebrowLabel>

            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-[1.12] tracking-tight text-white mt-6">
              Concerts. Festivals. Listening rooms.
              <br />
              Built for the way music is{' '}
              <em className="italic text-champagne">meant to travel.</em>
            </h1>

            <p className="mt-7 max-w-md mx-auto text-[15px] leading-relaxed text-white/90">
              An independent live-music house — booking, staging, sound and light,
              engineered around the audience in the room.
            </p>

            <div className="mt-9 mx-auto h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </section>

        {/* About Section */}
        <section id="about">
          <AboutContent showHero={false} />
        </section>

        {/* Featured Show Card */}
        {featured && (
            <section className="px-6 pt-8 pb-14" aria-label="Featured Show">
              <FeaturedShowCard show={featured} />
            </section>
        )}



        {/* Past Shows Section */}
        {past.length > 0 && (
            <section className="px-6 py-12 opacity-40 pointer-events-none" aria-label="Past Shows">
              <div className="max-w-2xl mx-auto">
                <SectionHeader title="Past Shows" count={past.length} />

                <div className="space-y-0 border border-charcoal rounded-sm overflow-hidden">
                  {past.map((show) => (
                      <ShowCard key={show._id} show={show} isPast={true} />
                  ))}
                </div>
              </div>
            </section>
        )}
      </main>
  )
}
