# לא נופלים בפח — Scam Awareness Lesson

An interactive e-learning module (Hebrew, right-to-left) that teaches how to recognise online scams and phishing. About 7 minutes, built with **React** and **Vite**.

## Learning objectives

By the end of the lesson the learner can:

1. Recognise five common signs of a scam message.
2. Check where a link really leads before clicking it.
3. Know what to do if they already clicked.

## Lesson flow

| Screen | Type | What the learner does |
|---|---|---|
| What is phishing? | Content | Short introduction |
| 5 warning signs | Explore | Opens five cards, one per warning sign (all five must be opened to continue) |
| Real or scam? | Decision | Judges 4 SMS / email / WhatsApp messages and gets an explanation for each |
| Where does the link lead? | Hotspot | Taps the part of a web address that is the real website |
| Find the signs | Hotspot | Finds 4 warning signs hidden in a fake bank email |
| You clicked. Now what? | Ordering | Puts 5 recovery steps in the right order |
| Final quiz | Multiple choice | 4 scenario questions |
| Summary | Results | Score out of 16 and the key takeaways |

Every exercise gives immediate, explanatory feedback: not just "right" or "wrong", but *why*.

## Accessibility

- Semantic HTML: real buttons, `fieldset`/`legend` for quiz questions, `role="progressbar"` for progress.
- Fully usable with a keyboard; visible focus outline on every control.
- The ordering exercise uses up/down buttons instead of drag-and-drop only, so it works with a keyboard and screen readers.
- Feedback is announced to screen readers (`aria-live`), and focus moves to each new screen's heading.
- Right-to-left layout with `lang="he"`; mixed Hebrew/English text uses `dir="auto"`.
- Respects `prefers-reduced-motion`; responsive down to small phones.

## Content and code are separate

All text, messages, questions and answers live in [`src/data/lesson.js`](src/data/lesson.js). The components in `src/components/` only know how to display an exercise type, so a new lesson on a different topic only needs a new data file.

All brand names, phone numbers and web addresses in the exercises are fictional.

## Running it

```bash
npm install
npm run dev
```

Build a static version (for example for GitHub Pages):

```bash
npm run build
```

## Credits

Designed and written by Hila Gabay (2026), with the help of an AI coding assistant.
