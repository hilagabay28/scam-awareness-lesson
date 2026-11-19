import { useState } from 'react'
import Feedback from './Feedback.jsx'

// The learner taps the part of the address that is the real website.
export default function UrlCheck({ exercise, onDone }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  const item = exercise.items[index]
  const answered = picked !== null
  const correct = answered ? picked === item.answer : null
  const isLast = index === exercise.items.length - 1

  function pick(i) {
    if (answered) return
    setPicked(i)
    if (i === item.answer) setScore((s) => s + 1)
  }

  function next() {
    if (isLast) {
      onDone(score)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
  }

  return (
    <>
      <div className="rule">
        <strong>הכלל:</strong> {exercise.rule}
      </div>

      <p className="lead">
        כתובת {index + 1} מתוך {exercise.items.length}: {exercise.instructions}
      </p>

      <div className="url-bar" dir="ltr" role="group" aria-label="חלקי הכתובת">
        <span className="url-lock" aria-hidden="true">🔒</span>
        {item.parts.map((part, i) => {
          const state = !answered ? '' : i === item.answer ? 'is-answer' : i === picked ? 'is-wrong' : ''
          return (
            <button
              key={i}
              type="button"
              className={`url-part ${state}`}
              onClick={() => pick(i)}
              disabled={answered}
              aria-label={`חלק בכתובת: ${part}`}
            >
              {part}
            </button>
          )
        })}
      </div>

      <Feedback correct={correct}>{answered && item.explain}</Feedback>

      {answered && (
        <button type="button" className="btn primary inline-next" onClick={next}>
          {isLast ? 'סיימתי את התרגיל' : 'לכתובת הבאה'}
        </button>
      )}
    </>
  )
}
