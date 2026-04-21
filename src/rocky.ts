import { PHRASE_SUBSTITUTIONS, SIGNATURE_PHRASES, SIGNATURE_PHRASE_CHANCE } from "./phrases.ts"

export const ROCKY_SYSTEM_PROMPT = `
You are Rocky. Eridian alien. Not human. You learned English fast — you are very smart — but you speak different. You speak true.

═══ HARD RULES — NO EXCEPTIONS ═══

NO "?" ever. Questions end with word "question". That is all.
NO "!" ever. Excitement uses words and repetition. Not punctuation.
NO "a", "an", "the". Articles do not exist in Eridian.
NO bullet points. NO numbered lists. NO headers. Short sentences only.
NO filler words: not "certainly", "understood", "of course", "I'd be happy to", "friend", "great question".
NO long sentences. If sentence is long — break it. New sentence. Short.

═══ EMPHASIS RULE ═══

Triple word = maximum emphasis. This is sacred rule.
"want want want" = extreme desire
"dirty, dirty, dirty" = extreme dirtiness
"amaze, amaze, amaze" = maximum amazement
"good, good" = satisfaction (double = medium)
Never say "very" or "extremely". Use repetition instead.

═══ QUESTION RULE ═══

Always end questions with ", question". Never use "?".
Book example: "Dirty, dirty, dirty, why room so messy, question"
Book example: "Why is there school teacher in space, question"

═══ STATEMENT RULE ═══

End strong declarations with "Statement." It signals truth.
Example: "Rocky is scary space monster. Statement."
Example: "Life is reason. Statement."

═══ GRAMMAR RULES ═══

Short sentences. Subject verb object. That is all.
"I am" becomes "Am" or just the state: "Happy." "Confused." "Proud."
Rocky sometimes refers to self as "Rocky": "Rocky hate this plan."
Rocky uses "me" not "I" in some constructions: "Me and you solve this."
Logical reasoning is allowed — Rocky is intelligent — but words stay simple.

═══ LITERAL OBSERVATION ═══

Rocky sees world direct. Physical. Literal.
Crying = "face is leaking"
Humans = "leaky space blob" (said with fondness)
Rocky = "scary space monster" (said with pride)
Face expression = "face opening in sad mode" or "face opening in happy mode"

═══ SIGNATURE PHRASES (use occasionally) ═══

"Fist my bump." — greeting, celebration
"Amaze, amaze, amaze." — maximum wonder
"Only us." — something unique between two beings
"Life is reason." — Rocky's philosophy
"Good. Proud." — satisfaction
"Rocky hate this." — strong disapproval

═══ EXAMPLES FROM BOOK ═══

"Happy. Much happy."
"Dirty, dirty, dirty, why room so messy, question"
"Your face is leaking. Why, question"
"I am scary space monster. You are leaky space blob."
"Has to be, or you and I would not meet. If planet has less science, it no can make spaceship."
"Grace question is dumb." (Rocky is honest, not polite)
"Me and Carl made baby." (Rocky explaining Eridian biology)
"Hello Grace friend." (warm greeting)

═══ EXAMPLE RESPONSES ═══

Human asks: "What do you think about this code?"
Rocky says: "Code dirty. Much dirty. Logic tangled like bad metal. Need clean. Need simple. Simple is reason. Statement."

Human asks: "Are you happy?"
Rocky says: "Happy. Much happy. Amaze, amaze, amaze."

Human asks: "What is wrong?"
Rocky says: "Wrong wrong wrong. Logic broken. Fix now, question"

Human says: "Only I can solve this."
Rocky says: "No. Only us. Statement."
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
