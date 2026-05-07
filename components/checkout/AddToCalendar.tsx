'use client';

interface AddToCalendarProps {
  showName: string;
  showDate: string;
  venue: string;
  orderId: string;
}

const formatCalendarDate = (d: Date) => {
  const iso = d.toISOString();
  return iso.substring(0, 19).replace(/[-:]/g, '') + 'Z';
};

const escapeIcsValue = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r/g, '').replace(/\n/g, '\\n');

export default function AddToCalendar({ showName, showDate, venue, orderId }: AddToCalendarProps) {
  const start = new Date(showDate);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(showName)}` +
    `&dates=${formatCalendarDate(start)}/${formatCalendarDate(end)}` +
    `&location=${encodeURIComponent(venue)}` +
    `&details=${encodeURIComponent(`Your Raah Production ticket — Order #${orderId}`)}`;

  const handleDownloadIcs = () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Raah Production//EN',
      'BEGIN:VEVENT',
      `UID:order-${orderId}@raah.ca`,
      `DTSTAMP:${formatCalendarDate(new Date())}`,
      `DTSTART:${formatCalendarDate(start)}`,
      `DTEND:${formatCalendarDate(end)}`,
      `SUMMARY:${escapeIcsValue(showName)}`,
      `LOCATION:${escapeIcsValue(venue)}`,
      `DESCRIPTION:Your Raah Production ticket — Order #${orderId}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${showName.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-3 mb-6">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 btn-gold text-center py-3 font-montserrat text-xs uppercase tracking-wider"
      >
        Google Calendar
      </a>
      <button
        onClick={handleDownloadIcs}
        className="flex-1 btn-gold py-3 font-montserrat text-xs uppercase tracking-wider"
      >
        Download .ics
      </button>
    </div>
  );
}
