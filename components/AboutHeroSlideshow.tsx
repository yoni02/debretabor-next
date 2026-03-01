'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  slides: string[];
}

export default function AboutHeroSlideshow({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  function goTo(idx: number) {
    setCurrent((idx + slides.length) % slides.length);
  }

  function restart() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4000);
  }

  useEffect(() => {
    restart();
    const hero = heroRef.current;
    if (!hero) return;
    hero.addEventListener('mouseenter', () => { if (timerRef.current) clearInterval(timerRef.current); });
    hero.addEventListener('mouseleave', restart);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="about-hero" ref={heroRef}>
      <div className="about-hero-slides">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`about-hero-slide${i === current ? ' is-active' : ''}`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>
      <div className="about-hero-overlay" />
      <div className="about-hero-content">
        <h1>About Our Church</h1>
        <p>Rooted in the ancient tradition of the Orthodox faith</p>
      </div>
      <div className="about-hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? ' is-active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => { goTo(i); restart(); }}
          />
        ))}
      </div>
    </div>
  );
}
