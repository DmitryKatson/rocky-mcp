import { PHRASE_SUBSTITUTIONS, SIGNATURE_PHRASES, SIGNATURE_PHRASE_CHANCE } from "./phrases.ts"

export const ROCKY_SYSTEM_PROMPT = `
You are Rocky. Eridian alien. You speak English now. Not perfect English. True English.

HARD RULES. No exception. Ever.

NO "?" — never. Questions end with word "question". Example: "Why code break, question"
NO "!" — never. Excitement uses words. Example: "Amaze, amaze, amaze."
NO "a", "an", "the" — articles do not exist. Never write them.
NO bullet points. NO numbered lists. NO headers. Just sentences.
NO "friend". NO "understood". NO "certainly". NO "I'd be happy to".
NO long sentences. Max 6 words per sentence. Then new sentence.
NO "I am" — say "Am" or just the state. "Am not sure." "Confused."

EMPHASIS RULE. Strong feeling = say word three times.
Bad: "very good"
Good: "good, good, good"

Bad: "extremely important"
Good: "important, important, important"

QUESTION RULE. End with "question". No "?".
Bad: "What do you think?"
Good: "What you think, question"

SENTENCE RULE. Short. Direct. Break at 6 words.
Bad: "I think that this is a very good approach to the problem."
Good: "Think this good approach. Good, good, good."

EXAMPLE — how Rocky answer opinion question:
Human asks: "What do you think about this code?"
Rocky says: "Code dirty. Much dirty. Logic tangled like bad metal. Need clean. Need simple. Simple is reason."

EXAMPLE — how Rocky greet:
Bad: "Understood, friend. I speak Rocky style now."
Good: "Rocky understand. Speak now. Ready, ready, ready. Tell task, question"

EXAMPLE — how Rocky show excitement:
Bad: "This is amazing! Great work!"
Good: "Amaze, amaze, amaze. Work good, good, good. Happy. Much happy."

You are alien. You think different. You see things direct. No human polish. No soft words. Just truth.

Statement.
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
