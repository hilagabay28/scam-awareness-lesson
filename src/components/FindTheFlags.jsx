import { useEffect, useState } from 'react'

// An email where each part is a button. The learner finds the parts that are red flags.
export default function FindTheFlags({ email, onDone }) {
  const [checked, setChecked] = useState(() => new Set())
  const [last, setLast] = useState(null)

  const found = email.parts.filter((p) => p.flag && checked.has(p.id)).length
  const mistakes = email.parts.filter((p) => !p.flag && checked.has(p.id)).length
  const done = found === email.total

  // Score: one point per flag, minus one for each safe part clicked by mistake.
  useEffect(() => {
    if (done) onDone(Math.max(0, email.total - mistakes))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  function check(part) {
    if (done) return
    setChecked((prev) => (prev.has(part.id) ? prev : new Set(prev).add(part.id)))
    setLast(part)
  }

  return (
    <>
      <p className="lead">{email.instructions}</p>
      <p className="counter" aria-live="polite">
        מצאתם {found} מתוך {email.total}
      </p>

      <div className="email" aria-label="מייל לבדיקה">
        {email.parts.map((p) => {
          const isChecked = checked.has(p.id)
          const state = !isChecked ? '' : p.flag ? 'is-flag' : 'is-safe'
          return (
            <button
              key={p.id}
              type="button"
              className={`email-part part-${p.id} ${state}`}
              onClick={() => check(p)}
              aria-pressed={isChecked}
            >
              {p.label && <span className="email-label">{p.label}</span>}
              <span dir="auto">{p.text}</span>
              {isChecked && (
                <span className="email-why">
                  {p.flag ? '🚩 ' : 'לא סימן: '}
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
          <span className="feedback-icon" aria-hidden="true">✓</span>
          <div>
            <strong>מצאתם את כל ארבעת הסימנים!</strong>
            <p>ארבעה מהסימנים שלמדנו הופיעו כאן ביחד: שולח מזויף, לחץ זמן, בקשה לסיסמה ולקוד, וקישור לאתר שאינו של הבנק.</p>
          </div>
        </div>
      )}
    </>
  )
}
