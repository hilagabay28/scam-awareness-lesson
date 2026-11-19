import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, Flip)

// Development only: lets testing tools jump animations to their end. Not in the built site.
if (import.meta.env.DEV && typeof window !== 'undefined') window.__gsap = gsap

export { gsap, Flip, useGSAP }

export const reducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

/** Elements marked [data-reveal] inside `scope` slide up into place, one after another. */
export function revealIn(scope, { delay = 0.15 } = {}) {
  const items = scope.querySelectorAll('[data-reveal]')
  if (!items.length) return
  if (reducedMotion()) {
    gsap.set(items, { opacity: 1, y: 0 })
    return
  }
  gsap.fromTo(
    items,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay },
  )
}

/** A rubber-stamp slam: big and tilted, then down hard onto the page. */
export function stamp(el) {
  if (!el) return
  if (reducedMotion()) {
    gsap.set(el, { opacity: 1, scale: 1, rotate: -8 })
    return
  }
  gsap.fromTo(
    el,
    { opacity: 0, scale: 2.4, rotate: -24 },
    { opacity: 1, scale: 1, rotate: -8, duration: 0.45, ease: 'back.out(2.2)' },
  )
}

/** A short "no" shake for a wrong answer. */
export function shake(el) {
  if (!el || reducedMotion()) return
  gsap.to(el, { keyframes: { x: [0, -10, 9, -6, 4, 0] }, duration: 0.4, ease: 'none' })
}

/** Feedback panel slides in. */
export function slideIn(el) {
  if (!el) return
  if (reducedMotion()) return
  gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
}
