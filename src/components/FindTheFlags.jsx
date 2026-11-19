import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion } from '../lib/motion.js'

// An email where each part is a button. Found warning signs get swept with a highlighter.
export default function FindTheFlags({ email, onDone }) {
  const [checked, setChecked] = useState(() => new Set())
  const [last, setLast] = useState(null)
  const scope = useRef(null)

  const found = email.parts.filter((p) => p.flag && checked.has(p.id)).length
  const mistakes = email.parts.filter((p) => !p.flag && checked.has(p.id)).length
  const done = found === email.total

  // Score: one point per flag, minus one for each safe part clicked by mistake.
  useEffect(() => {
    if (done) onDone(Math.max(0, email.total - mistakes))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  // Sweep the highlighter / reveal the note on the part just clicked.
  useEffect(() => {
    if (!last || reducedMotion()) return
    const el = scope.current?.querySelector(`[data-part="${last.id}"]`)
    if (!el) return
    const marker = el.querySelector('.hl')
    const why = el.querySelector('.email-why')
    if (marker) gsap.fromTo(marker, { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 0.6, ease: 'power2.inOut' })
    if (why) gsap.fromTo(why, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.25 })
  }, [last])

  function check(part) {
    if (done || checked.has(part.id)) return
    setChecked((prev) => new Set(prev).add(part.id))
    setLast(part)
  }

  return (
    <div ref={scope} className="stack">
      <div className="row-between" data-reveal>
        <p className="lead">{email.instructions}</p>
        <p className="tally" aria-live="polite">
          <span className="tally-num">{found}</span>/{email.total}
        </p>
      </div>

      <div className="email" aria-label="מייל לבדיקה" data-reveal>
        <div className="email-bar" aria-hidden="true">
          <span>תיבת דואר נכנס</span>
          <span className="mono-label">1 הודעה חדשה</span>
        </div>
        {email.parts.map((p) => {
          const isChecked = checked.has(p.id)
          const state = !isChecked ? '' : p.flag ? 'is-flag' : 'is-safe'
          return (
            <button
              key={p.id}
              type="button"
              data-part={p.id}
              className={`email-part part-${p.id} ${state}`}
              onClick={() => check(p)}
              aria-pressed={isChecked}
            >
              {p.label && <span className="email-label">{p.label}</span>}
              <span className="email-text">
                <span dir="auto" className={isChecked && p.flag ? 'hl' : ''}>
                  {p.text}
                </span>
              </span>
              {isChecked && (
                <span className="email-why">
                  <b>{p.flag ? 'סימן: ' : 'לא סימן: '}</b>
                  {p.why}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {last && (last.flag ? `נכון, זה סימן. ${last.why}` : `זה לא סימן. ${last.why}`)}
      </div>

      {done && (
        <div className="feedback is-correct" role="status">
          <span className="feedback-mark" aria-hidden="true">✓</span>
          <div>
            <strong>מצאתם את כל ארבעת הסימנים.</strong>
            <p>ארבעה מהסימנים שלמדנו הופיעו כאן ביחד: שולח מזויף, לחץ זמן, בקשה לסיסמה ולקוד, וקישור לאתר שאינו של הבנק.</p>
          </div>
        </div>
      )}
    </div>
  )
}
