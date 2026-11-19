import { useState } from 'react'
import Feedback from './Feedback.jsx'

export default function Quiz({ questions, onDone }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const q = questions[index]
  const isLast = index === questions.length - 1
  const correct = submitted ? picked === q.answer : null

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
    <>
      <p className="counter">
        שאלה {index + 1} מתוך {questions.length}
      </p>
      <fieldset className="quiz">
        <legend className="quiz-q">{q.q}</legend>
        {q.options.map((opt, i) => {
          const state = !submitted ? '' : i === q.answer ? 'is-answer' : i === picked ? 'is-wrong' : ''
          return (
            <label key={i} className={`quiz-option ${picked === i ? 'is-picked' : ''} ${state}`}>
              <input
                type="radio"
                name={`q${index}`}
                checked={picked === i}
                onChange={() => setPicked(i)}
                disabled={submitted}
              />
              <span dir="auto">{opt}</span>
            </label>
          )
        })}
      </fieldset>

      {!submitted && (
        <button type="button" className="btn primary inline-next" onClick={submit} disabled={picked === null}>
          בדיקה
        </button>
      )}

      <Feedback correct={correct}>{submitted && q.explain}</Feedback>

      {submitted && (
        <button type="button" className="btn primary inline-next" onClick={next}>
          {isLast ? 'לתוצאות' : 'לשאלה הבאה'}
        </button>
      )}
    </>
  )
}
