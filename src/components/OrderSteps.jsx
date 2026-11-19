import { useState } from 'react'
import Feedback from './Feedback.jsx'

function shuffled(list) {
  // A fixed, clearly wrong order, so the exercise is never accidentally solved from the start.
  const order = [3, 0, 4, 2, 1]
  return order.map((i) => list[i])
}

// Ordering exercise with "up" / "down" buttons, which work with a keyboard and a screen reader
// (unlike drag and drop on its own).
export default function OrderSteps({ exercise, onDone }) {
  const [items, setItems] = useState(() => shuffled(exercise.correct))
  const [result, setResult] = useState(null) // null | array of booleans
  const [tries, setTries] = useState(0)
  const [announce, setAnnounce] = useState('')

  const allRight = result?.every(Boolean)

  function move(from, to) {
    if (to < 0 || to >= items.length || allRight) return
    const next = [...items]
    ;[next[from], next[to]] = [next[to], next[from]]
    setItems(next)
    setResult(null)
    setAnnounce(`"${next[to]}" עבר למקום ${to + 1}`)
  }

  function check() {
    const res = items.map((t, i) => t === exercise.correct[i])
    setResult(res)
    const t = tries + 1
    setTries(t)
    if (res.every(Boolean)) onDone(t === 1 ? 1 : 0)
  }

  return (
    <>
      <p className="lead">{exercise.instructions}</p>

      <ol className="order-list">
        {items.map((text, i) => {
          const state = result ? (result[i] ? 'is-right' : 'is-off') : ''
          return (
            <li key={text} className={`order-item ${state}`}>
              <span className="order-num" aria-hidden="true">{i + 1}</span>
              <span className="order-text">{text}</span>
              <span className="order-btns">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0 || allRight} aria-label={`הזיזו למעלה: ${text}`}>
                  ▲
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1 || allRight} aria-label={`הזיזו למטה: ${text}`}>
                  ▼
                </button>
              </span>
            </li>
          )
        })}
      </ol>
      <div className="sr-only" aria-live="polite">{announce}</div>

      {!allRight && (
        <button type="button" className="btn primary inline-next" onClick={check}>
          בדקו את הסדר
        </button>
      )}

      {result && (
        <Feedback
          correct={allRight}
          title={allRight ? 'הסדר נכון!' : `${result.filter(Boolean).length} מתוך ${items.length} במקום. הפעולות במקום הלא נכון מסומנות, נסו שוב.`}
        >
          {allRight && exercise.explain}
        </Feedback>
      )}
    </>
  )
}
