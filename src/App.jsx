import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { lesson, intro, redFlags, messages, urlExercise, hotspotEmail, steps, quiz, summary } from './data/lesson.js'
import { gsap, useGSAP, revealIn, reducedMotion } from './lib/motion.js'
import Heading from './components/Heading.jsx'
import RedFlags from './components/RedFlags.jsx'
import RealOrScam from './components/RealOrScam.jsx'
import UrlCheck from './components/UrlCheck.jsx'
import FindTheFlags from './components/FindTheFlags.jsx'
import OrderSteps from './components/OrderSteps.jsx'
import Quiz from './components/Quiz.jsx'
import Noise from './components/bits/Noise.jsx'
import Magnet from './components/bits/Magnet.jsx'
import CountUp from './components/bits/CountUp.jsx'
import ScrollVelocity from './components/bits/ScrollVelocity.jsx'

// The lesson flow. "gate: true" = the learner has to finish the screen before moving on.
const SCREENS = [
  { id: 'welcome', title: lesson.title },
  { id: 'intro', chapter: 'רקע', title: intro.heading },
  { id: 'flags', chapter: 'סימנים', title: '5 סימנים להונאה', gate: true },
  { id: 'realOrScam', chapter: 'תרגיל 1', title: 'אמיתית או הונאה?', gate: true, max: messages.length },
  { id: 'url', chapter: 'תרגיל 2', title: urlExercise.heading, gate: true, max: urlExercise.items.length },
  { id: 'findFlags', chapter: 'תרגיל 3', title: hotspotEmail.heading, gate: true, max: hotspotEmail.total },
  { id: 'steps', chapter: 'תרגיל 4', title: steps.heading, gate: true, max: 1 },
  { id: 'quiz', chapter: 'בוחן', title: 'בוחן מסכם', gate: true, max: quiz.length },
  { id: 'summary', chapter: 'סיכום', title: summary.heading },
]

const MAX_SCORE = SCREENS.reduce((sum, s) => sum + (s.max ?? 0), 0)

const TAPE = ['החבילה שלך מעוכבת', 'זכית בפרס!', 'החשבון שלך ייחסם', 'היי, החלפתי מספר', 'אמתו את פרטיכם', 'פעלו עכשיו']

const pad = (n) => String(n).padStart(2, '0')

export default function App() {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState({}) // screen id -> true
  const [scores, setScores] = useState({}) // screen id -> points
  const [runId, setRunId] = useState(0) // changes on restart, to reset every exercise
  const headingRef = useRef(null)
  const mainRef = useRef(null)
  const lenisRef = useRef(null)
  const firstRender = useRef(true)

  const screen = SCREENS[index]
  const canGoNext = !screen.gate || done[screen.id]
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  const progress = index / (SCREENS.length - 1)

  // Smooth scrolling (Lenis). Off for people who asked for reduced motion.
  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1 })
    lenisRef.current = lenis
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  // Every new screen: content slides in, the page scrolls to the top,
  // and keyboard / screen-reader focus moves to the heading.
  useGSAP(() => {
    revealIn(mainRef.current)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 0.6 })
    else window.scrollTo(0, 0)
    headingRef.current?.focus({ preventScroll: true })
  }, [index, runId])

  // The progress line grows to its new length.
  useGSAP(() => {
    gsap.to('.progress-fill', { scaleX: progress, duration: reducedMotion() ? 0 : 0.8, ease: 'power3.inOut' })
  }, [progress])

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

  const verdict =
    total >= MAX_SCORE * 0.8
      ? 'קשה מאוד לעבוד עליכם.'
      : total >= MAX_SCORE * 0.5
        ? 'עוד קצת תרגול ואתם מומחים.'
        : 'שווה לעבור על הלומדה שוב.'

  return (
    <div className="app">
      <Noise fixed opacity={0.06} fps={12} blendMode="multiply" zIndex={50} />

      <header className="topbar">
        <span className="wordmark">לא נופלים בפח</span>
        <div className="progress" role="progressbar" aria-label="התקדמות בלומדה" aria-valuemin={1} aria-valuemax={SCREENS.length} aria-valuenow={index + 1}>
          <div className="progress-fill" />
        </div>
        <span className="mono-label">
          {pad(index + 1)}/{pad(SCREENS.length)}
        </span>
      </header>

      <main className={`screen screen-${screen.id}`} key={`${runId}-${screen.id}`} ref={mainRef}>
        {screen.id === 'welcome' ? (
          <div className="welcome">
            <p className="kicker" data-reveal>לומדה · {lesson.minutes} דקות · 5 תרגילים</p>
            <Heading title={lesson.title} headingRef={headingRef} hero />
            <p className="hero-sub" data-reveal>{lesson.subtitle}</p>

            <div className="tape-frame" aria-hidden="true" data-reveal>
              <div className="tape">
                <ScrollVelocity texts={[TAPE.join('  ⚠  ') + '  ⚠  ']} velocity={40} numCopies={4} className="tape-text" />
              </div>
            </div>

            <div className="objectives" data-reveal>
              <h2 className="mono-label">בסוף הלומדה תדעו</h2>
              <ol>
                {lesson.objectives.map((o, i) => (
                  <li key={o}>
                    <span className="obj-num" aria-hidden="true">{pad(i + 1)}</span>
                    {o}
                  </li>
                ))}
              </ol>
            </div>

            <div data-reveal>
              <Magnet padding={60} magnetStrength={3}>
                <button type="button" className="btn primary big" onClick={() => setIndex(1)}>
                  מתחילים ←
                </button>
              </Magnet>
            </div>
          </div>
        ) : (
          <Heading chapter={`${pad(index)} — ${screen.chapter}`} title={screen.title} headingRef={headingRef} />
        )}

        {screen.id === 'intro' && (
          <div className="prose">
            {intro.paragraphs.map((p, i) => (
              <p key={p} data-reveal className={i === 0 ? 'pull' : ''}>
                {p}
              </p>
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
            <div className="score" data-reveal>
              <p className="score-big" aria-hidden="true">
                <CountUp to={total} duration={1.6} />
                <span className="score-of">/{MAX_SCORE}</span>
              </p>
              <p className="sr-only">
                צברתם {total} נקודות מתוך {MAX_SCORE}.
              </p>
              <p className="score-msg">{verdict}</p>
            </div>
            <ol className="takeaways">
              {summary.points.map((p, i) => (
                <li key={p} data-reveal>
                  <span className="obj-num" aria-hidden="true">{pad(i + 1)}</span>
                  {p}
                </li>
              ))}
            </ol>
            <div data-reveal>
              <button type="button" className="btn ghost" onClick={restart}>
                ↺ להתחיל מחדש
              </button>
            </div>
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
          <Magnet padding={40} magnetStrength={4} disabled={!canGoNext}>
            <button type="button" className="btn primary" onClick={() => setIndex((i) => i + 1)} disabled={!canGoNext}>
              הבא ←
            </button>
          </Magnet>
        </nav>
      )}

      <footer className="footer">
        <span>לומדה לדוגמה מתוך תיק העבודות של הילה גבאי</span>
        <span>השמות והכתובות בתרגילים בדויים</span>
      </footer>
    </div>
  )
}
