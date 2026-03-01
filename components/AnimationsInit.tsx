'use client';

import { useEffect } from 'react';

interface Props {
  isHome?: boolean;
}

export default function AnimationsInit({ isHome }: Props) {
  useEffect(() => {
    if (isHome) document.body.classList.add('home-page');
    else document.body.classList.remove('home-page');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('page-loaded');
      return;
    }

    function initPageEnter() {
      requestAnimationFrame(() => {
        document.body.classList.add('page-loaded');
        const heroSeq = [
          { sel: '.hero-badge',    delay: 0.05 },
          { sel: '.hero-title',    delay: 0.22 },
          { sel: '.hero-subtitle', delay: 0.42 },
          { sel: '.hero-actions',  delay: 0.58 },
        ];
        heroSeq.forEach(item => {
          const el = document.querySelector<HTMLElement>(item.sel);
          if (!el) return;
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = `opacity 0.65s ease ${item.delay}s, transform 0.65s ease ${item.delay}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            });
          });
        });
      });
    }

    const rules: { sel: string; anim: string; stagger?: number; delay?: number }[] = [
      { sel: '.mission-title',        anim: 'anim-fade-up' },
      { sel: '.mission-text',         anim: 'anim-fade-up', delay: 0.12 },
      { sel: '.timeline-title',       anim: 'anim-fade-up' },
      { sel: '.icons-title',          anim: 'anim-fade-up' },
      { sel: '.icons-subtitle',       anim: 'anim-fade-up', delay: 0.1 },
      { sel: '.page-header h1',       anim: 'anim-fade-up' },
      { sel: '.page-header p',        anim: 'anim-fade-up', delay: 0.12 },
      { sel: '.about-hero-content h1',anim: 'anim-fade-up' },
      { sel: '.about-hero-content p', anim: 'anim-fade-up', delay: 0.14 },
      { sel: '.about-icons-title',    anim: 'anim-fade-up' },
      { sel: '.about-icons-subtitle', anim: 'anim-fade-up', delay: 0.1 },
      { sel: '.content-section h2',   anim: 'anim-fade-up' },
      { sel: '.content-section p',    anim: 'anim-fade-up', delay: 0.1 },
      { sel: '.section-divider',      anim: 'anim-fade-in' },
      { sel: '.quick-card',           anim: 'anim-scale-in', stagger: 0.08 },
      { sel: '.photo-strip-item',     anim: 'anim-scale-in', stagger: 0.1 },
      { sel: '.gallery-item',         anim: 'anim-scale-in', stagger: 0.07 },
      { sel: '.icon-frame',           anim: 'anim-scale-in', stagger: 0.12 },
      { sel: '.about-icon-frame',     anim: 'anim-scale-in', stagger: 0.09 },
      { sel: '.timeline-item',        anim: 'anim-timeline' },
      { sel: '.about-split-img',      anim: 'anim-split-img' },
      { sel: '.about-split-text',     anim: 'anim-fade-up' },
      { sel: '.about-church-feature', anim: 'anim-fade-up' },
      { sel: '.ministry-card',        anim: 'anim-scale-in', stagger: 0.1 },
      { sel: '.schedule-item',        anim: 'anim-fade-left', stagger: 0.1 },
      { sel: '.contact-card',         anim: 'anim-scale-in', stagger: 0.09 },
      { sel: '.faq-item',             anim: 'anim-fade-up', stagger: 0.08 },
      { sel: '.info-card',            anim: 'anim-scale-in', stagger: 0.1 },
    ];

    function initScrollReveal() {
      const allEls: Element[] = [];

      rules.forEach(rule => {
        let nodes: NodeListOf<Element>;
        try { nodes = document.querySelectorAll(rule.sel); } catch { return; }

        nodes.forEach((el, idx) => {
          let animClass = rule.anim;

          if (animClass === 'anim-timeline') {
            const siblings = el.parentElement?.querySelectorAll('.timeline-item') ?? [];
            const pos = Array.prototype.indexOf.call(siblings, el);
            animClass = pos % 2 === 0 ? 'anim-fade-left' : 'anim-fade-right';
          }
          if (animClass === 'anim-split-img') {
            const split = el.closest('.about-split');
            animClass = split?.classList.contains('about-split--reverse') ? 'anim-fade-right' : 'anim-fade-left';
          }

          if (!el.classList.contains('scroll-anim-ready')) {
            el.classList.add('scroll-anim-ready', animClass);
            const htmlEl = el as HTMLElement;
            if (rule.stagger !== undefined) {
              htmlEl.style.animationDelay = `${idx * rule.stagger}s`;
              htmlEl.style.transitionDelay = `${idx * rule.stagger}s`;
            }
            if (rule.delay !== undefined) {
              htmlEl.style.animationDelay = `${rule.delay}s`;
              htmlEl.style.transitionDelay = `${rule.delay}s`;
            }
            allEls.push(el);
          }
        });
      });

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

      allEls.forEach(el => observer.observe(el));
    }

    initPageEnter();
    initScrollReveal();

    return () => {
      document.body.classList.remove('page-loaded', 'home-page');
    };
  }, [isHome]);

  return null;
}
