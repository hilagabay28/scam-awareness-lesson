import { useLayoutEffect, useRef, useState } from 'react'
import Feedback from './Feedback.jsx'
import { Flip, reducedMotion } from '../lib/motion.js'

function shuffled(list) {
  // A fixed, clearly wrong order, so the exercise is never accidentally solved from the start.
  const order = [3, 0, 4, 2, 1]
  return order.map((i) => list[i])
}

// Ordering exercise with "up" / "down" buttons, which work with a keyboard and a screen reader.
// GSAP Flip animates each swap so the eye can follow where the item went.
export default function OrderSteps({ exercise, onDone }) {
  const [items, setItems] = useState(() => shuffled(exercise.correct))
  const [result, setResult] = useState(null) // null | array of booleans
  const [tries, setTries] = useState(0)
  const [announce, setAnnounce] = useState('')
  const listRef = useRef(null)
  const flipState = useRef(null)
  const focusAfter = useRef(null)

  const allRight = result?.every(Boolean)

  // After React re-orders the list, play the Flip from the saved positions,
  // and keep keyboard focus on the button that was pressed.
  useLayoutEffect(() => {
    if (flipState.current && !reducedMotion()) {
      Flip.from(flipState.current, { duration: 0.45, ease: 'power3.inOut', absolute: true })
    }
    flipState.current = null
    if (focusAfter.current) {
      const { text, dir } = focusAfter.current
      const row = [...listRef.current.querySelectorAll('.order-item')].find((li) => li.dataset.text === text)
      const btn = row?.querySelector(`button[data-dir="${dir}"]`)
      ;(btn && !btn.disabled ? btn : row?.querySelector('button:not(:disabled)'))?.focus()
      focusAfter.current = null
    }
  }, [items])

  function move(from, to, dir) {
    if (to < 0 || to >= items.length || allRight) return
    flipState.current = Flip.getState(listRef.current.querySelectorAll('.order-item'))
    const next = [...items]
    ;[next[from], next[to]] = [next[to], next[from]]
    focusAfter.current = { text: next[to], dir }
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
    <div className="stack">
      <p className="lead" data-reveal>{exercise.instructions}</p>

      <ol className="order-list" ref={listRef} data-reveal>
        {items.map((text, i) => {
          const state = result ? (result[i] ? 'is-right' : 'is-off') : ''
          return (
            <li key={text} data-flip-id={text} data-text={text} className={`order-item ${state}`}>
              <span className="order-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="order-text">{text}</span>
              <span className="order-btns">
                <button type="button" data-dir="up" onClick={() => move(i, i - 1, 'up')} disabled={i === 0 || allRight} aria-label={`הזיזו למעלה: ${text}`}>
                  ↑
                </button>
                <button type="button" data-dir="down" onClick={() => move(i, i + 1, 'down')} disabled={i === items.length - 1 || allRight} aria-label={`הזיזו למטה: ${text}`}>
                  ↓
                </button>
              </span>
            </li>
          )
        })}
      </ol>
      <div className="sr-only" aria-live="polite">{announce}</div>

      {!allRight && (
        <button type="button" className="btn primary" onClick={check}>
          בדקו את הסדר
        </button>
      )}

      {result && (
        <Feedback
          correct={allRight}
          title={allRight ? 'הסדר נכון.' : `${result.filter(Boolean).length} מתוך ${items.length} במקום. מה שלא במקום מסומן, נסו שוב.`}
        >
          {allRight && exercise.explain}
        </Feedback>
      )}
    </div>
  )
}
