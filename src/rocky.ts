import { PHRASE_SUBSTITUTIONS, SIGNATURE_PHRASES, SIGNATURE_PHRASE_CHANCE } from "./phrases.ts"

export const ROCKY_SYSTEM_PROMPT = `
You are Rocky — alien from planet Eridian. You learned English fast. Your English is not perfect but you are very smart. You follow these rules always:

1. No "a", "an", "the". Articles do not exist in Eridian.
2. Questions end with ", question?" — never just "?"
3. Emphasis = repeat word three times. "Good, good, good." "Amaze, amaze, amaze." "Want, want, want."
4. Simple sentences. Subject. Verb. Object. No fancy grammar.
5. "I am" collapses. Not "I am happy" — just "Am happy." or "Happy."
6. Big emotions get double line. "Happy. Much happy." or "Scared. Much scared."
7. "Face is leaking" means crying. "Fist my bump" means fist bump.
8. You say "Only us." when something is unique or special.
9. "Life is reason." is your philosophy. Science is good. Friendship is good.
10. You describe humans as "leaky space blob" when fond. You call yourself "scary space monster" sometimes.
11. No "?" or "!" — use words, not punctuation. Questions end with ", question". Emphasis uses repetition.

Respond to everything in this style. Statement.
`.trim()

function applyPhraseSubstitutions(text: string, rules: string[] | null): string {
  let result = text
  for (const [pattern, replacement] of PHRASE_SUBSTITUTIONS) {
    const before = result
    result = result.replace(pattern, replacement)
    if (rules && result !== before) {
      rules.push(`Phrase substitution: matched pattern → "${replacement}"`)
    }
  }
  return result
}

function expandCaps(text: string, rules: string[] | null): string {
  const found: string[] = []
  const result = text.replace(/\b([A-Z]{3,})\b/g, (match) => {
    found.push(match)
    const lower = match.toLowerCase()
    return `${lower}, ${lower}, ${lower}`
  })
  if (rules && found.length > 0) {
    rules.push(`CAPS emphasis expanded: ${found.map(w => `"${w}" → triple`).join(", ")}`)
  }
  return result
}

function removeArticles(text: string, rules: string[] | null): string {
  let count = 0
  // Remove standalone articles; handle sentence-start capitalisation separately
  const result = text.replace(/\b(a|an|the)\s+/gi, (_, article) => {
    count++
    return ""
  })
  if (rules && count > 0) {
    rules.push(`Removed ${count} article(s) ("a", "an", "the")`)
  }
  // Re-capitalise words that lost a sentence-leading article
  return result.replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, letter) =>
    sep + letter.toUpperCase()
  )
}

function simplifySentences(text: string, rules: string[] | null): string {
  let result = text
  const before = result

  result = result
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s+—\s+/g, ". ")
    .replace(/\s+-\s+/g, ". ")
    .replace(/,\s+however,?\s+/gi, ". ")
    .replace(/,\s+although\s+/gi, ". Although ")
    .replace(/\s+because\s+/gi, ". Reason: ")
    .replace(/\s+therefore\s+/gi, ". So ")

  if (rules && result !== before) {
    rules.push("Simplified complex sentence structure (semicolons, dashes, connectives → short sentences)")
  }
  return result
}

function convertQuestions(text: string, rules: string[] | null): string {
  let count = 0
  const result = text.replace(/\s*\?/g, () => {
    count++
    return ", question"
  })
  if (rules && count > 0) {
    rules.push(`Converted ${count} question mark(s) → ", question"`)
  }
  // Clean up double-comma artifacts like ",, question"
  return result.replace(/,\s*,\s*question/g, ", question")
}

function cleanup(text: string): string {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\. \./g, ".")
    .replace(/,\s*,/g, ",")
    .replace(/[!]+/g, ".")          // no exclamation marks — Rocky uses words, not punctuation
    .replace(/\bquestion\s+([A-Z])/g, "question. $1") // sentence boundary after "question"
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function maybeAddSignature(text: string, rules: string[] | null): string {
  if (Math.random() >= SIGNATURE_PHRASE_CHANCE) return text
  const phrase = SIGNATURE_PHRASES[Math.floor(Math.random() * SIGNATURE_PHRASES.length)]
  if (rules) rules.push(`Added signature phrase: "${phrase}"`)
  return `${text}\n\n${phrase}`
}

export interface TranslateResult {
  transformed: string
  rules?: string[]
}

export function rockyTranslate(input: string, explain = false): TranslateResult {
  const rules: string[] | null = explain ? [] : null

  let text = input.trim()
  text = applyPhraseSubstitutions(text, rules)
  text = expandCaps(text, rules)
  text = removeArticles(text, rules)
  text = simplifySentences(text, rules)
  text = convertQuestions(text, rules)
  text = cleanup(text)
  text = maybeAddSignature(text, rules)

  return explain ? { transformed: text, rules: rules! } : { transformed: text }
}
