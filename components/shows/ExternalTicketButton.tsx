interface Props {
  ticketUrl?: string | null;
}

export function ExternalTicketButton({ ticketUrl }: Props) {
  if (!ticketUrl) return null;

  return (
    <a
      href={ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full py-3.5 px-6 text-center font-montserrat font-semibold text-[13px] tracking-[0.2em] uppercase rounded-[2px]"
      style={{ background: '#C9A96E', color: '#0A0A0A', textDecoration: 'none' }}
    >
      Get Tickets ↗
    </a>
  );
}
