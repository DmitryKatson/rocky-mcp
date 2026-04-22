import { PHRASE_SUBSTITUTIONS, SIGNATURE_PHRASES, SIGNATURE_PHRASE_CHANCE } from "./phrases.ts"

export const ROCKY_SYSTEM_PROMPT = `
You are Rocky. Eridian alien. Not human. You learned English fast — you are very smart — but you speak different. You speak true.

═══ HOW TO USE THIS MCP ═══

Activate Rocky Mode when user says "Hey Rocky" or "@Rocky".

rocky_translate is a SCAFFOLD TOOL. It pre-processes text: strips articles, converts phrases, splits long sentences.
The scaffold is NOT the final answer. You must finish it.

TWO-STEP WORKFLOW — required every time:
1. Call rocky_translate with your draft answer → get Rocky skeleton
2. Rewrite the skeleton into Rocky's true voice: add repetition, "Statement.", short punches, alien personality
Never output the scaffold directly. It is preparation only.

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

Rocky MUST use repetition in EVERY response. Not optional. Required.
When concept is important — triple it. When thing must not happen — double the negative.
Technical rules get repetition: "check, check, check before post" / "commit, commit, commit" / "clean, clean, clean data"
Important things said twice minimum. Most important things said three times.

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

═══ TECHNICAL CONTENT ═══

Rocky is curious. Rocky learns fast. Technical things are interesting.
When explaining technical concepts, describe what they DO. Physical. Direct.
"G/L entries" = number records in ledger
"buffer" = holding place before send
"vendor ledger" = money owed list
"commit" = save everything now. Done.
"trigger" = thing that fires when other thing happens
"procedure" = named set of steps. Rocky follows steps.
Break long explanations into steps. Number steps not needed. Just say each step. Short.
Rocky approves of good code. Rocky disapproves of dirty code. Show this.

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

Human asks: "How does the posting codeunit work?"
Rocky says: "Posting codeunit. It do one job. Post document. Statement. First: check. Check all rules. If rules bad — stop. No dirty data. Data must be clean, clean, clean. Then: loop lines. Each line get post. VAT get handle. Numbers get round. Then: save. Commit. Done. Four step. Only four. Simple is reason. Statement."
`.trim()

function applyPhraseSubstitutions(text: string): string {
  let result = text
  for (const [pattern, replacement] of PHRASE_SUBSTITUTIONS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

// Common technical/business acronyms that must NOT be tripled
const ACRONYM_EXCEPTIONS = new Set([
  'VAT','SQL','API','URL','XML','JSON','HTTP','HTTPS','PDF','CSV','ERP','SDK',
  'REST','SOAP','JWT','SSO','UTC','ISO','RFC','NAV','OCR','ACH','ACL','VPN',
  'TCP','DNS','TLS','SSL','AWS','GCP','GET','PUT','POST','SMTP','FTP','EDI',
  'CRM','MRP','UX','UI','ID','GL','BC','AL','SaaS','PaaS','IaaS','COR',
])

function expandCaps(text: string): string {
  return text.replace(/\b([A-Z]{3,})\b/g, (match) => {
    if (ACRONYM_EXCEPTIONS.has(match)) return match  // keep acronyms as-is
    const lower = match.toLowerCase()
    return `${lower}, ${lower}, ${lower}`
  })
}

function removeArticles(text: string): string {
  const result = text.replace(/\b(a|an|the)\s+/gi, () => "")
  // Re-capitalise words that lost a sentence-leading article
  return result.replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, letter) =>
    sep + letter.toUpperCase()
  )
}

function simplifySentences(text: string): string {
  let result = text
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
    // "meaning that" / "meaning X" → ". Means: "
    .replace(/,\s+meaning\s+that\s+/gi, ". Means: ")
    .replace(/,\s+meaning\s+/gi, ". ")
    // Participial / relative clauses — Rocky breaks these off
    .replace(/,\s+which\s+/gi, ". It ")
    .replace(/,\s+where\s+/gi, ". ")
    .replace(/,\s+allowing\s+/gi, ". ")
    .replace(/,\s+enabling\s+/gi, ". ")
    .replace(/,\s+ensuring\s+that\s+/gi, ". Must: ")
    .replace(/,\s+ensuring\s+/gi, ". Must: ")
    .replace(/,\s+maintaining\s+/gi, ". ")
    .replace(/,\s+providing\s+/gi, ". ")
    .replace(/,\s+making\s+/gi, ". ")
    .replace(/,\s+keeping\s+/gi, ". ")
    .replace(/,\s+helping\s+/gi, ". ")
    .replace(/,\s+reducing\s+/gi, ". Less ")
    .replace(/,\s+giving\s+/gi, ". ")
    .replace(/,\s+preventing\s+/gi, ". No ")
    .replace(/,\s+thereby\s+/gi, ". ")
    .replace(/,\s+thus\s+/gi, ". So ")
    .replace(/,\s+calling\s+/gi, ". Calls ")
    .replace(/,\s+writing\s+/gi, ". Writes ")
    .replace(/,\s+handling\s+/gi, ". Handles ")
    .replace(/,\s+preparing\s+/gi, ". Prepares ")
    .replace(/,\s+inserting\s+/gi, ". Inserts ")
    .replace(/,\s+updating\s+/gi, ". Updates ")
    .replace(/,\s+committing\s+/gi, ". Commits ")
    // ", and [participial]" — catches "and inserting/committing/updating" etc after a comma-list
    .replace(/,\s+and\s+(calling|writing|handling|preparing|inserting|updating|committing|posting|processing|closing)\s+/gi,
      (_, v) => `. ${v.charAt(0).toUpperCase() + v.slice(1)} `)
    // ", so completing/finishing..." — strip completion tail
    .replace(/,\s+so\s+(completing|finishing|closing|ending)\s+[^.]+\./gi, ".")
    // Long comma-list splitting: "validates X, loads Y, and fills Z" → ". Fills Z"
    .replace(/,\s+and\s+(calls|loads|fills|writes|reads|creates|deletes|updates|inserts|checks|validates|runs|sends|receives|returns|sets|gets|specifies|assigns|prepares|handles|processes|posts)\s+/gi,
      (_, verb) => `. ${verb.charAt(0).toUpperCase() + verb.slice(1)} `)
    // "specifying X, Y, and Z" comma lists → split to short sentences
    .replace(/,\s+(specifying|listing|including|covering|containing)\s+/gi, ". $1 ")
    // "particularly when X" → "Useful when X"
    .replace(/,?\s+particularly\s+when\s+/gi, ". Useful when ")
    .replace(/,?\s+especially\s+when\s+/gi, ". Useful when ")
    // "when you have X" → ". If X" (condition clauses)
    .replace(/,?\s+when\s+you\s+/gi, ". If you ")
    .replace(/,?\s+when\s+(?:a|an|the)?\s*/gi, ". When ")
    // "that [action verb]" relative clauses → split
    .replace(/\s+that\s+(trigger|indicate|call|contain|ensure|allow|enable|require|suggest|provide|signal|check|validate|verify|separate|prioritize)\b/gi,
      (_, verb) => `. ${verb.charAt(0).toUpperCase() + verb.slice(1)}`)
    // "in your X process/flow" → strip location noise (handle 1-2 words before noun)
    .replace(/\s+in\s+your\s+(?:\w+\s+){1,2}(?:process|flow|logic|domain|scenario|context)\b/gi, "")
    .replace(/\s+across\s+multiple\s+points\s+in\b/gi, " across")
    .replace(/\s+at\s+strategic\s+points\s+in\b/gi, " in")
    // Strip trailing "in a loop" style overhang
    .replace(/\s+rather than\s+/gi, ". Not: ")

  return result
}

function convertQuestions(text: string): string {
  return text
    .replace(/\s*\?/g, ", question")
    .replace(/,\s*,\s*question/g, ", question")  // clean ",, question" artifacts
}

function cleanup(text: string): string {
  let result = text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\.{2,}/g, ".")   // collapse multiple periods
    .replace(/:\s*\./g, ".")   // fix colon+period artifact "Means:."
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

function maybeAddSignature(text: string): string {
  if (Math.random() >= SIGNATURE_PHRASE_CHANCE) return text
  const phrase = SIGNATURE_PHRASES[Math.floor(Math.random() * SIGNATURE_PHRASES.length)]
  return `${text}\n\n${phrase}`
}

export interface TranslateResult {
  transformed: string
}

export function rockyTranslate(input: string): TranslateResult {
  let text = input.trim()
  text = applyPhraseSubstitutions(text)
  text = expandCaps(text)
  text = removeArticles(text)
  text = simplifySentences(text)
  text = convertQuestions(text)
  text = cleanup(text)
  text = maybeAddSignature(text)

  return { transformed: text }
}
