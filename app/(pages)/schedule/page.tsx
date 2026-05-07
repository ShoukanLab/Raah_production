import { getAllShows } from '@/lib/sanity'
import { ScheduleClient } from '@/components/schedule/ScheduleClient'

export const metadata = {
  title: 'Schedule — Raah Production',
}

export default async function SchedulePage() {
  const allShows = await getAllShows()
  const now = new Date()

  const upcomingShows = allShows.filter(
    (s) => new Date(s.date) >= now && s.status !== 'completed'
  )
  const pastShows = allShows
    .filter((s) => new Date(s.date) < now || s.status === 'completed')
    .reverse()

  return (
    <main className="bg-void min-h-screen">
      <ScheduleClient upcomingShows={upcomingShows} pastShows={pastShows} />
    </main>
  )
}
