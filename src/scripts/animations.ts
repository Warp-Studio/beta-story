import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Lenis smooth scroll ──────────────────────────────────────────────────────
const lenis = new Lenis();

// Keep ScrollTrigger in sync with Lenis scroll position
lenis.on('scroll', ScrollTrigger.update);

// Drive Lenis via GSAP's RAF (avoids double rAF)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── Hero entrance timeline ───────────────────────────────────────────────────
const heroTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
heroTl
  .from('.hero-badge',   { opacity: 0, y: 20, duration: 0.8 })
  .from('.hero-title',   { opacity: 0, y: 28, duration: 0.9 }, '-=0.55')
  .from('.hero-desc',    { opacity: 0, y: 20, duration: 0.8 }, '-=0.55')
  .from('.hero-btns',    { opacity: 0, y: 20, duration: 0.8 }, '-=0.55')
  .from('.hero-divider', { opacity: 0, scaleX: 0, duration: 0.7, transformOrigin: 'center' }, '-=0.45')
  .from('.hero-stats',   { opacity: 0, y: 20, duration: 0.8 }, '-=0.45');

// ── Scroll reveals via ScrollTrigger ────────────────────────────────────────
gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 32,
    duration: 0.75,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    },
  });
});
