import { useEffect, useState } from 'react';
import VideoPlayer from '../ui/VideoPlayer.jsx';
import WhatsAppButton from '../ui/WhatsAppButton.jsx';

function useShouldLoadHeroVideo() {
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    const isMobile = matchMedia('(max-width: 640px)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldLoad(!isMobile && !saveData && !reducedMotion);
  }, []);
  return shouldLoad;
}

export default function Hero() {
  const shouldLoadVideo = useShouldLoadHeroVideo();

  return (
    <section id="top" className="relative isolate flex min-h-[100dvh] items-end overflow-hidden">
      <div className="absolute inset-0 -z-20">
        {shouldLoadVideo ? (
          <VideoPlayer
            src="/videos/hero.mp4"
            poster="/posters/hero.svg"
            label="Pilotage VTT en montagne"
            preload="metadata"
          />
        ) : (
          <img
            src="/posters/hero.svg"
            alt="Pilotage VTT en montagne"
            width="1920"
            height="1080"
            loading="eager"
            className="size-full object-cover"
          />
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(22,22,20,0.1) 0%, rgba(22,22,20,0.35) 45%, rgba(22,22,20,0.72) 100%)' }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-32 md:px-8 md:pb-32">
        <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.22em]" style={{ color: '#EBE6DD' }}>
          bikementor · Grenoble
        </p>
        <h1
          className="mt-4 max-w-4xl font-[var(--font-display)] leading-[1.02]"
          style={{ fontSize: 'var(--text-hero)', color: '#EBE6DD', letterSpacing: '-0.02em' }}
        >
          Rouler <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>juste</em>, rouler loin.
        </h1>
        <div className="mt-10">
          <WhatsAppButton>Discuter sur WhatsApp</WhatsAppButton>
        </div>
      </div>

      <a
        href="#prestations"
        aria-label="Défiler vers le bas"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ color: '#EBE6DD' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
