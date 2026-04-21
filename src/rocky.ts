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
    // Hard separators
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s+—\s+/g, ". ")
    .replace(/\s+-\s+/g, ". ")
    // Connectives → new sentences
    .replace(/,\s+however,?\s+/gi, ". ")
    .replace(/,\s+although\s+/gi, ". Although ")
    .replace(/\s+because\s+/gi, ". Reason: ")
    .replace(/\s+therefore\s+/gi, ". So ")
    // Participial / relative clauses — Rocky breaks these off
    .replace(/,\s+which\s+/gi, ". It ")
    .replace(/,\s+where\s+/gi, ". ")
    .replace(/,\s+allowing\s+/gi, ". ")
    .replace(/,\s+enabling\s+/gi, ". ")
    .replace(/,\s+ensuring\s+/gi, ". ")
    .replace(/,\s+maintaining\s+/gi, ". ")
    .replace(/,\s+providing\s+/gi, ". ")
    .replace(/,\s+making\s+/gi, ". ")
    .replace(/,\s+keeping\s+/gi, ". ")
    .replace(/,\s+helping\s+/gi, ". ")
    .replace(/,\s+reducing\s+/gi, ". Less ")
    .replace(/,\s+giving\s+/gi, ". ")
    .replace(/,\s+preventing\s+/gi, ". No ")
    // "particularly when X" → "Useful when X"
    .replace(/,?\s+particularly\s+when\s+/gi, ". Useful when ")
    .replace(/,?\s+especially\s+when\s+/gi, ". Useful when ")
    // "when you have X" → ". If X" (condition clauses)
    .replace(/,?\s+when\s+you\s+/gi, ". If you ")
    .replace(/,?\s+when\s+(?:a|an|the)?\s*/gi, ". When ")
    // "that [action verb]" relative clauses → split
    .replace(/\s+that\s+(trigger|indicate|call|contain|ensure|allow|enable|require|suggest|provide|signal|check|validate|verify)\b/gi,
      (_, verb) => `. ${verb.charAt(0).toUpperCase() + verb.slice(1)}`)
    // "in your X process/flow" → strip location noise (handle 1-2 words before noun)
    .replace(/\s+in\s+your\s+(?:\w+\s+){1,2}(?:process|flow|logic|domain|scenario|context)\b/gi, "")
    .replace(/\s+across\s+multiple\s+points\s+in\b/gi, " across")
    .replace(/\s+at\s+strategic\s+points\s+in\b/gi, " in")
    // Strip trailing "in a loop" style overhang
    .replace(/\s+rather than\s+/gi, ". Not: ")

  if (rules && result !== before) {
    rules.push("Split participial phrases and relative clauses into short sentences")
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
  let result = text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\. \./g, ".")
    .replace(/,\s*,/g, ",")
    .replace(/[!]+/g, ".")
    .replace(/\bquestion\s+([A-Z])/g, "question. $1")
    .replace(/\n{3,}/g, "\n\n")
    // Remove dangling participial fragments left by sentence splits
    .replace(/\s+and\s+(?:allowing|enabling|ensuring|maintaining|providing|making|keeping|reducing|helping|batching)\b[^.]*\./g, ".")
    .replace(/\s+and so\s+(?:\w+\s+){0,5}\./g, ".")
    // Orphaned conjunctions at sentence start or before period → strip
    .replace(/\.\s+[Aa]nd\s+/g, ". ")
    .replace(/\.\s+[Oo]r\s+/g, ". ")
    .replace(/\s+and\s*\./g, ".")
    .replace(/\s+or\s*\./g, ".")
    .replace(/\s+but\s*\./g, ".")
    .replace(/\s+\./g, ".")   // trailing spaces before period
    .trim()

  // Capitalise all sentence starts — runs AFTER all splits so every new boundary is fixed
  result = result.replace(/(^|[.]\s+)([a-z])/g, (_, sep, letter) =>
    sep + letter.toUpperCase()
  )
  return result
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
