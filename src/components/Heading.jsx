import DecryptedText from './bits/DecryptedText.jsx'

const HEBREW_GLYPHS = 'אבגדהוזחטיכלמנסעפצקרשת#%&*'

// Screen heading: a small chapter label, then the title "decrypting" into place.
// DecryptedText keeps a hidden plain copy of the text for screen readers.
export default function Heading({ chapter, title, headingRef, hero = false }) {
  return (
    <header className={`screen-head ${hero ? 'is-hero' : ''}`}>
      {chapter && (
        <p className="chapter" data-reveal>
          {chapter}
        </p>
      )}
      <h1 ref={headingRef} tabIndex={-1} className={hero ? 'hero-title' : 'title'}>
        <DecryptedText
          text={title}
          animateOn="view"
          sequential
          revealDirection="start"
          speed={hero ? 45 : 32}
          characters={HEBREW_GLYPHS}
          encryptedClassName="glyph-scrambled"
        />
      </h1>
    </header>
  )
}
