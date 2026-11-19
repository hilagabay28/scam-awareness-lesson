import { useRef, useState } from 'react'
import Feedback from './Feedback.jsx'
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js'

// The learner taps the part of the address that is the real website.
export default function UrlCheck({ exercise, onDone }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const scope = useRef(null)

  const item = exercise.items[index]
  const answered = picked !== null
  const correct = answered ? picked === item.answer : null
  const isLast = index === exercise.items.length - 1

  // The address types itself into the bar.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.from('.url-part', { opacity: 0, y: 10, duration: 0.35, ease: 'power2.out', stagger: 0.12, delay: 0.15 })
    },
    { scope, dependencies: [index] },
  )

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
    <div ref={scope} className="stack">
      <div className="rule" data-reveal>
        <span className="rule-tag">הכלל</span>
        <p>{exercise.rule}</p>
      </div>

      <p className="lead" data-reveal>
        <span className="mono-label">{String(index + 1).padStart(2, '0')}/{String(exercise.items.length).padStart(2, '0')}</span>{' '}
        {exercise.instructions}
      </p>

      <div className="browser" data-reveal>
        <div className="browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="url-bar" dir="ltr" role="group" aria-label="חלקי הכתובת">
          {item.parts.map((part, i) => {
            const state = !answered ? '' : i === item.answer ? 'is-answer' : i === picked ? 'is-wrong' : 'is-dim'
            return (
              <button
                key={`${index}-${i}`}
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
      </div>

      <Feedback correct={correct}>{answered && item.explain}</Feedback>

      {answered && (
        <button type="button" className="btn primary" onClick={next}>
          {isLast ? 'סיימתי את התרגיל' : 'לכתובת הבאה ←'}
        </button>
      )}
    </div>
  )
}
