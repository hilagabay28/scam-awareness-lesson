import { useRef } from 'react'
import { useGSAP, slideIn, shake } from '../lib/motion.js'

// Feedback after an answer. role="status" makes screen readers announce it.
export default function Feedback({ correct, title, children }) {
  const ref = useRef(null)

  useGSAP(() => {
    if (correct === null || correct === undefined) return
    slideIn(ref.current)
    if (!correct) shake(ref.current)
  }, [correct, title])

  if (correct === null || correct === undefined) {
    return <div role="status" aria-live="polite" className="sr-only" />
  }
  return (
    <div ref={ref} role="status" aria-live="polite" className={`feedback ${correct ? 'is-correct' : 'is-wrong'}`}>
      <span className="feedback-mark" aria-hidden="true">{correct ? '✓' : '✕'}</span>
      <div>
        <strong>{title ?? (correct ? 'נכון.' : 'לא בדיוק.')}</strong>
        {children && <p>{children}</p>}
      </div>
    </div>
  )
}
