import { useEffect, useState } from 'react'

// Five cards; the learner opens each one. "Next" unlocks once all were opened.
export default function RedFlags({ flags, onDone }) {
  const [opened, setOpened] = useState(() => new Set())

  useEffect(() => {
    if (opened.size === flags.length) onDone()
    // onDone only needs to run once, when the last card opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened.size, flags.length])

  function toggle(id) {
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }

  return (
    <>
      <p className="lead">לחצו על כל כרטיס כדי לגלות את הסימן.</p>
      <p className="counter" aria-live="polite">
        פתחתם {opened.size} מתוך {flags.length}
      </p>
      <ul className="flag-grid">
        {flags.map((f) => {
          const isOpen = opened.has(f.id)
          return (
            <li key={f.id}>
              <button
                type="button"
                className={`flag-card ${isOpen ? 'is-open' : ''}`}
                aria-expanded={isOpen}
                onClick={() => toggle(f.id)}
              >
                <span className="flag-icon" aria-hidden="true">{f.icon}</span>
                <span className="flag-title">{f.title}</span>
                {isOpen && <span className="flag-text">{f.text}</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
