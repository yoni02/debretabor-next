'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface Photo {
  src: string;
  caption: string;
  alt: string;
}

interface Props {
  photos: Photo[];
}

export default function GalleryGrid({ photos }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Touch swipe tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Scroll lock: set overflow hidden on both html and body.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // We deliberately avoid position:fixed on the body because on iOS Safari
  // it shifts the document origin and causes position:fixed children (the
  // lightbox) to be rendered at the wrong vertical position.
  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  };

  const openLightbox = (idx: number) => {
    setCurrent(idx);
    setLightboxOpen(true);
    setLoaded(false);
    lockScroll();
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLoaded(false);
    unlockScroll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = useCallback(() => {
    setLoaded(false);
    setCurrent(c => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const next = useCallback(() => {
    setLoaded(false);
    setCurrent(c => (c + 1) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, closeLightbox, prev, next]);

  // Clean up scroll lock if component unmounts while lightbox is open
  useEffect(() => {
    return () => { unlockScroll(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant and long enough
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    }
  }

  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="gallery-item"
            data-caption={photo.caption}
            onClick={() => openLightbox(i)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
            />
            <div className="gallery-caption">{photo.caption}</div>
            <div className="gallery-zoom-hint"><i className="fas fa-expand"></i></div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <div
        className={`lightbox${lightboxOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button className="lightbox-close" aria-label="Close" onClick={closeLightbox}>
          <i className="fas fa-times"></i>
        </button>
        <button className="lightbox-nav lightbox-prev" aria-label="Previous image" onClick={prev}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="lightbox-nav lightbox-next" aria-label="Next image" onClick={next}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <div className="lightbox-inner">
          {lightboxOpen && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={`lightbox-img${loaded ? ' lb-loaded' : ''}`}
              src={photos[current]?.src}
              alt={photos[current]?.alt}
              onLoad={() => setLoaded(true)}
            />
          )}
          <div className="lightbox-caption">{photos[current]?.caption}</div>
          <div className="lightbox-counter">{current + 1} / {photos.length}</div>
        </div>
        <div className="lightbox-backdrop" onClick={closeLightbox}></div>
      </div>
    </>
  );
}
