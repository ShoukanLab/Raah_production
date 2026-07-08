import type { ShowStatus } from '@/types/sanity'

const STATUS_LABELS: Record<ShowStatus, string> = {
  upcoming: 'Upcoming',
  selling_fast: 'Selling Fast',
  sold_out: 'Sold Out',
  completed: 'Completed',
}

export function getStatusLabel(status: ShowStatus): string {
  return STATUS_LABELS[status]
}
