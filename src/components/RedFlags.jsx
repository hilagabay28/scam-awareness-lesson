import { useEffect, useRef, useState } from 'react'
import SpotlightCard from './bits/SpotlightCard.jsx'
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js'

// Five cards; the learner opens each one. "Next" unlocks once all were opened.
export default function RedFlags({ flags, onDone }) {
  const [opened, setOpened] = useState(() => new Set())
  const scope = useRef(null)

  useEffect(() => {
    if (opened.size === flags.length) onDone()
    // onDone only needs to run once, when the last card opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened.size, flags.length])

  // Cards deal onto the table one after another.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.from('.flag', { y: 40, opacity: 0, rotate: (i) => (i % 2 ? 2 : -2), duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: 0.25 })
    },
    { scope },
  )

  function open(id) {
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
    if (!reducedMotion()) {
      requestAnimationFrame(() => {
        const text = scope.current?.querySelector(`[data-flag="${id}"] .flag-text`)
        if (text) gsap.from(text, { height: 0, opacity: 0, duration: 0.45, ease: 'power2.out' })
      })
    }
  }

  return (
    <div ref={scope}>
      <div className="row-between" data-reveal>
        <p className="lead">לחצו על כל כרטיס כדי לגלות את הסימן.</p>
        <p className="tally" aria-live="polite">
          <span className="tally-num">{opened.size}</span>/{flags.length}
        </p>
      </div>
      <ul className="flag-grid">
        {flags.map((f, i) => {
          const isOpen = opened.has(f.id)
          return (
            <li key={f.id} className="flag" data-flag={f.id}>
              <SpotlightCard
                theme="light"
                className={`flag-card ${isOpen ? 'is-open' : ''}`}
                spotlightColor="rgba(255, 74, 28, 0.22)"
                spotlightSize={260}
                style={{
                  '--spotlight-card-surface': isOpen ? 'var(--signal-soft)' : '#fbf8f2',
                  '--spotlight-card-border': 'var(--ink)',
                  '--spotlight-card-shadow': `4px 4px 0 ${isOpen ? 'var(--signal)' : 'var(--ink)'}`,
                }}
              >
                <button type="button" className="flag-btn" aria-expanded={isOpen} onClick={() => open(f.id)}>
                  <span className="flag-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flag-title">{f.title}</span>
                  {!isOpen && <span className="flag-hint" aria-hidden="true">לחצו לגילוי ←</span>}
                  {isOpen && <span className="flag-text">{f.text}</span>}
                </button>
              </SpotlightCard>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
