import { useRef, useState } from 'react'
import Feedback from './Feedback.jsx'
import { gsap, useGSAP, stamp, reducedMotion } from '../lib/motion.js'

// One message at a time: the learner decides "real" or "scam".
// The verdict lands on the phone as a rubber stamp.
export default function RealOrScam({ messages, onDone }) {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState(0)
  const scope = useRef(null)
  const stampRef = useRef(null)

  const msg = messages[index]
  const answered = choice !== null
  const correct = answered ? choice === msg.isScam : null
  const isLast = index === messages.length - 1

  // Each new message arrives like a notification.
  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.from('.bubble', { y: 24, opacity: 0, scale: 0.96, duration: 0.5, ease: 'back.out(1.6)', delay: 0.1 })
    },
    { scope, dependencies: [index] },
  )

  useGSAP(() => {
    if (answered) stamp(stampRef.current)
  }, [answered])

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
    <div ref={scope} className="split">
      <div className="phone-wrap" data-reveal>
        <div className="phone" aria-label={`הודעת ${msg.channel} מאת ${msg.from}`}>
          <div className="phone-notch" aria-hidden="true" />
          <div className="phone-top">
            <span className="phone-from" dir="auto">{msg.from}</span>
            <span className="phone-channel">{msg.channel}</span>
          </div>
          <p className="bubble" dir="auto">{msg.text}</p>
          {answered && (
            <div ref={stampRef} className={`stamp ${msg.isScam ? 'stamp-scam' : 'stamp-real'}`} aria-hidden="true">
              {msg.isScam ? 'הונאה' : 'אמיתית'}
            </div>
          )}
        </div>
        <p className="phone-count" aria-hidden="true" dir="ltr">
          {String(index + 1).padStart(2, '0')} / {String(messages.length).padStart(2, '0')}
        </p>
      </div>

      <div className="split-side" data-reveal>
        <p className="lead">
          <span className="sr-only">הודעה {index + 1} מתוך {messages.length}. </span>
          אמיתית או הונאה? תחליטו לפני שאתם קוראים את ההסבר.
        </p>

        <div className="verdict-row">
          <button type="button" className={`verdict real ${choice === false ? 'is-picked' : ''}`} onClick={() => answer(false)} disabled={answered}>
            אמיתית
          </button>
          <button type="button" className={`verdict scam ${choice === true ? 'is-picked' : ''}`} onClick={() => answer(true)} disabled={answered}>
            הונאה
          </button>
        </div>

        <Feedback correct={correct} title={answered ? (correct ? 'נכון.' : `לא. זו הודעה ${msg.isScam ? 'מזויפת' : 'אמיתית'}.`) : null}>
          {answered && msg.explain}
        </Feedback>

        {answered && (
          <button type="button" className="btn primary" onClick={next}>
            {isLast ? 'סיימתי את התרגיל' : 'להודעה הבאה ←'}
          </button>
        )}
      </div>
    </div>
  )
}
