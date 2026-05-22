"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface AboutContentProps {
  showHero?: boolean;
}

export function AboutContent({ showHero = true }: AboutContentProps) {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="bg-void">
      {/* HERO */}
      {showHero && (
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-28 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 60% 0%, rgba(201,169,110,0.12) 0%, transparent 55%),
              radial-gradient(ellipse at 0% 100%, rgba(201,169,110,0.05) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-3xl animate-in fade-in duration-1000">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold" />
            <span className="font-montserrat text-[10px] font-bold tracking-[0.35em] uppercase text-gold">
              About Us • Edmonton, AB
            </span>
          </div>

          <h1 className="font-pinyon text-[clamp(56px,10vw,96px)] text-white leading-none mb-2">
            Raah
          </h1>

          <p className="font-montserrat text-[9px] font-bold tracking-[0.45em] uppercase text-t3 mb-8">
            Production • Where Sound Travels
          </p>

          <div className="w-20 h-px bg-gradient-to-r from-gold to-transparent mb-8" />

          <h2 className="font-playfair italic text-[clamp(28px,5vw,44px)] text-white leading-tight mb-5 max-w-2xl">
            Built to create <span className="about-shimmer-text">unforgettable</span> live music experiences.
          </h2>

          <p className="font-montserrat text-sm text-t3 leading-relaxed max-w-xl mb-8">
            From intimate qawali nights to large-scale concerts — we are here to create moments that stay with you long
            after the night ends.
          </p>

          <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-3">
            <div className="w-10 h-px bg-t4" />
            <span className="font-montserrat text-[9px] font-semibold tracking-[0.2em] uppercase text-t4">
              Scroll
            </span>
          </div>
        </div>
      </section>
      )}

      {/* MANIFESTO */}
      <section className="max-w-4xl mx-auto px-6 py-12" ref={addReveal}>
        <div className="mb-12">
          <h3 className="font-montserrat text-[9px] font-bold tracking-[0.35em] uppercase text-gold mb-8">
            Our Story
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          <div className="about-reveal" ref={addReveal}>
            <h2 className="font-playfair text-[clamp(28px,4vw,44px)] font-normal text-white leading-tight mb-6">
              Music is more than
              <br />
              <span className="italic text-gold">sound.</span>
            </h2>

            <div className="pl-6 mb-4 border-l border-gold/25 space-y-2">
              <p className="font-cormorant text-lg italic text-t2 leading-relaxed">
                It's the pause before the lights dim.
              </p>
              <p className="font-cormorant text-lg italic text-t2 leading-relaxed">
                The silence before the first note.
              </p>
              <p className="font-cormorant text-lg italic text-t2 leading-relaxed">
                The energy that fills a room
              </p>
              <p className="font-cormorant text-lg italic text-t2 leading-relaxed">
                before a single word is sung.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-montserrat text-sm text-t3 leading-relaxed">
                Raah Production was created with one intention: to build unforgettable live music experiences in
                Edmonton. We believe every show is more than a performance — it's a shared moment between an artist and
                an audience that can never be replicated.
              </p>
              <p className="font-montserrat text-sm text-t3 leading-relaxed">
                From intimate qawali nights to large-scale concerts, we bring together the production craft, the
                community, and the culture to make it happen. And we're only getting started.
              </p>
            </div>
          </div>

          <div className="about-reveal" ref={addReveal}>
            <h4 className="font-montserrat text-[9px] font-bold tracking-[0.25em] uppercase text-t4 mb-6">
              What drives us
            </h4>

            <div className="space-y-4">
              {[
                {
                  num: "01",
                  title: "Culture",
                  desc: "We platform music that matters — from qawali and South Asian sounds to contemporary live performance. Every genre, every voice deserves a stage worthy of it.",
                },
                {
                  num: "02",
                  title: "Community",
                  desc: "Edmonton is our home. We build events that bring people together — not just audiences, but artists, crews, and the city's live music community.",
                },
                {
                  num: "03",
                  title: "Craft",
                  desc: "Every detail of a Raah show is intentional. Sound, staging, atmosphere — we obsess over the elements that transform a good concert into an unforgettable one.",
                },
              ].map((p) => (
                <div key={p.num} className="border-t border-charcoal pt-6 flex gap-4">
                  <span className="font-playfair text-sm text-t4 flex-shrink-0">{p.num}</span>
                  <div>
                    <h5 className="font-playfair text-xl text-white mb-2">{p.title}</h5>
                    <p className="font-montserrat text-xs text-t3 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT BAND */}
      <section className="bg-onyx border-y border-charcoal py-12 md:py-16 px-6 about-reveal" ref={addReveal}>
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-playfair italic text-[clamp(20px,3.5vw,36px)] text-white leading-relaxed mb-4">
            "This isn't just event production.
            <br />
            This is culture. This is community.
            <br />
            This is Raah."
          </blockquote>

          <p className="font-montserrat text-[9px] font-bold tracking-[0.3em] uppercase text-t4 flex items-center justify-center gap-4 mb-6">
            <span className="w-8 h-px bg-t4" />
            Raah Production • Edmonton
            <span className="w-8 h-px bg-t4" />
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
            {[
              { word: "Culture", sub: "Rooted in" },
              { word: "Community", sub: "Built for" },
              { word: "Sound", sub: "Driven by" },
            ].map((t) => (
              <div key={t.word} className="text-center">
                <div className="font-playfair italic text-2xl text-gold mb-1">{t.word}</div>
                <p className="font-montserrat text-[9px] font-semibold tracking-[0.2em] uppercase text-t4">
                  {t.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="max-w-4xl mx-auto px-6 py-12 about-reveal" ref={addReveal}>
        <h3 className="font-montserrat text-[9px] font-bold tracking-[0.35em] uppercase text-gold mb-8">
          What We Do
        </h3>

        <h2 className="font-playfair text-[clamp(28px,4vw,44px)] font-normal text-white leading-tight max-w-2xl mb-8">
          Live music production,
          <span className="italic text-gold"> end to end.</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-px border border-charcoal rounded-sm overflow-hidden">
          {[
            {
              title: "Concert Production",
              body: "Full-scale live concert production in Edmonton — from venue selection and stage design to sound, lighting, and artist coordination.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              ),
            },
            {
              title: "Qawali & Cultural Nights",
              body: "Specialists in intimate qawali evenings and South Asian cultural concerts — curating the atmosphere, acoustics, and audience experience.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
              ),
            },
            {
              title: "Live Events • YEG",
              body: "Edmonton's live entertainment scene, elevated. We produce shows that reflect the city's diversity and bring world-class experiences to local audiences.",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              ),
            },
          ].map((card) => (
            <div key={card.title} className="bg-onyx p-8 flex flex-col gap-4 border-r border-charcoal last:border-r-0">
              <div className="w-9 h-9 rounded border border-gold/20 flex items-center justify-center text-gold bg-gold/5">
                {card.icon}
              </div>
              <h4 className="font-playfair text-lg text-white">{card.title}</h4>
              <p className="font-montserrat text-xs text-t3 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 about-reveal" ref={addReveal}>
        <div>
          <h2 className="font-playfair italic text-[clamp(24px,3.5vw,38px)] text-white leading-tight mb-3">
            Ready to experience
            <br />a Raah show?
          </h2>
          <p className="font-montserrat text-sm text-t3 leading-relaxed">
            Browse upcoming events in Edmonton or get in touch about production services.
          </p>
        </div>
        <Link href="/shows" className="btn-gold-filled flex-shrink-0 whitespace-nowrap px-8 py-3 font-montserrat text-sm font-bold tracking-[0.15em] uppercase">
          View Upcoming Shows
        </Link>
      </section>
    </div>
  );
}
