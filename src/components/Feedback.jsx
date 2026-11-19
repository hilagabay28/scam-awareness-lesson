// Feedback box shown after an answer. role="status" makes screen readers announce it.
export default function Feedback({ correct, title, children }) {
  if (correct === null || correct === undefined) {
    return <div role="status" aria-live="polite" className="sr-only" />
  }
  return (
    <div role="status" aria-live="polite" className={`feedback ${correct ? 'is-correct' : 'is-wrong'}`}>
      <span className="feedback-icon" aria-hidden="true">{correct ? '✓' : '!'}</span>
      <div>
        <strong>{title ?? (correct ? 'נכון!' : 'לא בדיוק')}</strong>
        {children && <p>{children}</p>}
      </div>
    </div>
  )
}
