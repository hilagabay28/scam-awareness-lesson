import { useEffect, useRef, useState } from 'react'
import { lesson, intro, redFlags, messages, urlExercise, hotspotEmail, steps, quiz, summary } from './data/lesson.js'
import RedFlags from './components/RedFlags.jsx'
import RealOrScam from './components/RealOrScam.jsx'
import UrlCheck from './components/UrlCheck.jsx'
import FindTheFlags from './components/FindTheFlags.jsx'
import OrderSteps from './components/OrderSteps.jsx'
import Quiz from './components/Quiz.jsx'

// The lesson flow. "gate: true" = the learner has to finish the screen before moving on.
const SCREENS = [
  { id: 'welcome', title: lesson.title },
  { id: 'intro', title: intro.heading },
  { id: 'flags', title: '5 סימנים להונאה', gate: true },
  { id: 'realOrScam', title: 'אמיתית או הונאה?', gate: true, max: messages.length },
  { id: 'url', title: urlExercise.heading, gate: true, max: urlExercise.items.length },
  { id: 'findFlags', title: hotspotEmail.heading, gate: true, max: hotspotEmail.total },
  { id: 'steps', title: steps.heading, gate: true, max: 1 },
  { id: 'quiz', title: 'בוחן מסכם', gate: true, max: quiz.length },
  { id: 'summary', title: summary.heading },
]

const MAX_SCORE = SCREENS.reduce((sum, s) => sum + (s.max ?? 0), 0)

export default function App() {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState({}) // screen id -> true
  const [scores, setScores] = useState({}) // screen id -> points
  const [runId, setRunId] = useState(0) // changes on restart, to reset every exercise
  const headingRef = useRef(null)
  const firstRender = useRef(true)

  const screen = SCREENS[index]
  const canGoNext = !screen.gate || done[screen.id]
  const total = Object.values(scores).reduce((a, b) => a + b, 0)

  // Move keyboard / screen-reader focus to the new screen's heading.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  function complete(points) {
    setDone((d) => ({ ...d, [screen.id]: true }))
    if (typeof points === 'number') setScores((s) => ({ ...s, [screen.id]: points }))
  }

  function restart() {
    setDone({})
    setScores({})
    setRunId((r) => r + 1)
    setIndex(0)
  }

  const progress = Math.round((index / (SCREENS.length - 1)) * 100)

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span aria-hidden="true">🛡️</span> {lesson.title}
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="התקדמות בלומדה"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="step-count">
          {index + 1}/{SCREENS.length}
        </div>
      </header>

      <main className="card" key={`${runId}-${screen.id}`}>
        <h1 ref={headingRef} tabIndex={-1} className={screen.id === 'welcome' ? 'hero-title' : ''}>
          {screen.title}
        </h1>

        {screen.id === 'welcome' && (
          <div className="welcome">
            <p className="hero-sub">{lesson.subtitle}</p>
            <div className="welcome-box">
              <h2>בסוף הלומדה תדעו:</h2>
              <ul className="checks">
                {lesson.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <p className="meta">⏱ בערך {lesson.minutes} דקות · 5 תרגילים · בוחן קצר בסוף</p>
            </div>
            <button type="button" className="btn primary big" onClick={() => setIndex(1)}>
              יאללה, מתחילים
            </button>
          </div>
        )}

        {screen.id === 'intro' && (
          <div className="prose">
            {intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}

        {screen.id === 'flags' && <RedFlags flags={redFlags} onDone={() => complete()} />}
        {screen.id === 'realOrScam' && <RealOrScam messages={messages} onDone={complete} />}
        {screen.id === 'url' && <UrlCheck exercise={urlExercise} onDone={complete} />}
        {screen.id === 'findFlags' && <FindTheFlags email={hotspotEmail} onDone={complete} />}
        {screen.id === 'steps' && <OrderSteps exercise={steps} onDone={complete} />}
        {screen.id === 'quiz' && <Quiz questions={quiz} onDone={complete} />}

        {screen.id === 'summary' && (
          <div className="summary">
            <div
              className="score-ring"
              role="img"
              aria-label={`צברתם ${total} נקודות מתוך ${MAX_SCORE}`}
              style={{ '--pct': `${Math.round((total / MAX_SCORE) * 100)}%` }}
            >
              <span className="score-num">{total}</span>
              <span className="score-of">מתוך {MAX_SCORE}</span>
            </div>
            <p className="score-msg">
              {total >= MAX_SCORE * 0.8
                ? 'מעולה! קשה מאוד לעבוד עליכם.'
                : total >= MAX_SCORE * 0.5
                  ? 'יפה מאוד! עוד קצת תרגול ואתם מומחים.'
                  : 'התחלה טובה. שווה לעבור על הלומדה שוב.'}
            </p>
            <ul className="checks">
              {summary.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <button type="button" className="btn ghost" onClick={restart}>
              ↺ להתחיל מחדש
            </button>
          </div>
        )}
      </main>

      {screen.id !== 'welcome' && screen.id !== 'summary' && (
        <nav className="nav" aria-label="ניווט בין מסכים">
          <button type="button" className="btn ghost" onClick={() => setIndex((i) => i - 1)}>
            → הקודם
          </button>
          <span className="nav-hint" aria-live="polite">
            {!canGoNext && 'השלימו את התרגיל כדי להמשיך'}
          </span>
          <button
            type="button"
            className="btn primary"
            onClick={() => setIndex((i) => i + 1)}
            disabled={!canGoNext}
          >
            הבא ←
          </button>
        </nav>
      )}

      <footer className="footer">לומדה לדוגמה מתוך תיק העבודות של הילה גבאי · השמות והכתובות בתרגילים בדויים</footer>
    </div>
  )
}
