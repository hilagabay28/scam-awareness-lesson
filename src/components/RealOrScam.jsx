import { useState } from 'react'
import Feedback from './Feedback.jsx'

// One message at a time: the learner decides "real" or "scam" and gets an explanation.
export default function RealOrScam({ messages, onDone }) {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState(0)

  const msg = messages[index]
  const answered = choice !== null
  const correct = answered ? choice === msg.isScam : null
  const isLast = index === messages.length - 1

  function answer(isScam) {
    if (answered) return
    setChoice(isScam)
    if (isScam === msg.isScam) setScore((s) => s + 1)
  }

  function next() {
    if (isLast) {
      onDone(score)
      return
    }
    setIndex((i) => i + 1)
    setChoice(null)
  }

  return (
    <>
      <p className="lead">
        הודעה {index + 1} מתוך {messages.length}: אמיתית או הונאה?
      </p>

      <div className="phone" aria-label={`הודעת ${msg.channel} מאת ${msg.from}`}>
        <div className="phone-top">
          <span className="phone-channel">{msg.channel}</span>
          <span className="phone-from" dir="auto">{msg.from}</span>
        </div>
        <p className="bubble" dir="auto">{msg.text}</p>
      </div>

      <div className="choice-row">
        <button
          type="button"
          className={`choice ${answered && !msg.isScam ? 'is-answer' : ''} ${choice === false ? 'is-picked' : ''}`}
          onClick={() => answer(false)}
          disabled={answered}
        >
          ✓ אמיתית
        </button>
        <button
          type="button"
          className={`choice danger ${answered && msg.isScam ? 'is-answer' : ''} ${choice === true ? 'is-picked' : ''}`}
          onClick={() => answer(true)}
          disabled={answered}
        >
          ⚠ הונאה
        </button>
      </div>

      <Feedback correct={correct} title={answered ? (correct ? 'נכון!' : `זו הודעה ${msg.isScam ? 'מזויפת' : 'אמיתית'}`) : null}>
        {answered && msg.explain}
      </Feedback>

      {answered && (
        <button type="button" className="btn primary inline-next" onClick={next}>
          {isLast ? 'סיימתי את התרגיל' : 'להודעה הבאה'}
        </button>
      )}
    </>
  )
}
