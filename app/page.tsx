import { getFeaturedShow, getUpcomingShows, getPastShows } from '@/lib/sanity'
import { EyebrowLabel } from '@/components/ui/EyebrowLabel'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FeaturedShowCard, ShowCard } from '@/components/shows'

export const metadata = {
  title: {
    absolute: 'Raah Production — Live Music & Events',
  },
}

export default async function HomePage() {
  const [featured, upcoming, past] = await Promise.all([
    getFeaturedShow(),
    getUpcomingShows(),
    getPastShows(),
  ])

  const upcomingWithoutFeatured = upcoming.filter(
    (show) => !featured || show._id !== featured._id
  )

  return (
    <main className="bg-void">
      {/* Hero Section */}
      <section className="relative px-6 pt-12 pb-8">
        {/* Spotlight radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-gold/[8] to-transparent pointer-events-none" />

        <div className="relative z-10">
          <EyebrowLabel>Live Music & Events</EyebrowLabel>
          <h1 className="font-playfair text-5xl leading-tight text-white mt-3 mb-4">
            Where Sound
            <br />
            Travels
          </h1>
          <div className="h-px w-20 bg-gradient-to-r from-gold to-transparent" />
        </div>
      </section>

      {/* Featured Show Card */}
      {featured && (
        <section className="px-6 py-12" aria-label="Featured Show">
          <FeaturedShowCard show={featured} />
        </section>
      )}

      {/* Upcoming Shows Section */}
      <section className="px-6 py-12" aria-label="Upcoming Shows">
        <div className="max-w-2xl mx-auto">
          <SectionHeader
            title="Upcoming Shows"
            count={upcomingWithoutFeatured.length}
          />

          {upcomingWithoutFeatured.length > 0 ? (
            <div className="space-y-0 border border-charcoal rounded-sm overflow-hidden">
              {upcomingWithoutFeatured.map((show) => (
                <ShowCard key={show._id} show={show} />
              ))}
            </div>
          ) : (
            <p className="text-champagne/60 text-sm py-8 text-center">
              No upcoming shows at the moment.
            </p>
          )}
        </div>
      </section>

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
