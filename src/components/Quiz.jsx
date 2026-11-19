import { useRef, useState } from 'react'
import Feedback from './Feedback.jsx'
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js'

const LETTERS = ['א', 'ב', 'ג', 'ד']

export default function Quiz({ questions, onDone }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const scope = useRef(null)

  const q = questions[index]
  const isLast = index === questions.length - 1
  const correct = submitted ? picked === q.answer : null

  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.from('.quiz-q, .quiz-option', { opacity: 0, x: -20, duration: 0.45, ease: 'power3.out', stagger: 0.06 })
    },
    { scope, dependencies: [index] },
  )

  function submit() {
    if (picked === null) return
    setSubmitted(true)
    if (picked === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (isLast) {
      onDone(score)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setSubmitted(false)
  }

  return (
    <div ref={scope} className="stack">
      <p className="mono-label" data-reveal>
        שאלה {String(index + 1).padStart(2, '0')} מתוך {String(questions.length).padStart(2, '0')}
      </p>
      <fieldset className="quiz" data-reveal>
        <legend className="quiz-q">{q.q}</legend>
        {q.options.map((opt, i) => {
          const state = !submitted ? '' : i === q.answer ? 'is-answer' : i === picked ? 'is-wrong' : 'is-dim'
          return (
            <label key={`${index}-${i}`} className={`quiz-option ${picked === i ? 'is-picked' : ''} ${state}`}>
              <input type="radio" name={`q${index}`} checked={picked === i} onChange={() => setPicked(i)} disabled={submitted} />
              <span className="quiz-letter" aria-hidden="true">{LETTERS[i]}</span>
              <span dir="auto">{opt}</span>
            </label>
          )
        })}
      </fieldset>

      {!submitted && (
        <button type="button" className="btn primary" onClick={submit} disabled={picked === null}>
          בדיקה
        </button>
      )}

      <Feedback correct={correct}>{submitted && q.explain}</Feedback>

      {submitted && (
        <button type="button" className="btn primary" onClick={next}>
          {isLast ? 'לתוצאות ←' : 'לשאלה הבאה ←'}
        </button>
      )}
    </div>
  )
}
