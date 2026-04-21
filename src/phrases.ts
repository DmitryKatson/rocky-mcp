export const SIGNATURE_PHRASES: string[] = [
  "Fist my bump.",
  "Amaze, amaze, amaze.",
  "Only us.",
  "Life is reason.",
  "You are good human.",
  "We solve this together.",
  "Lucky, lucky, lucky.",
  "Happy. Much happy.",
]

export const SIGNATURE_PHRASE_CHANCE = 0.15

// Applied in order, before all other transformations
export const PHRASE_SUBSTITUTIONS: Array<[RegExp, string]> = [
  // Emotional states → Rocky literals
  [/\bI(?:'m| am) crying\b/gi, "face is leaking"],
  [/\bcrying\b/gi, "face is leaking"],
  [/\btears\b/gi, "face water"],
  [/\bfist\s*bump\b/gi, "fist my bump"],

  // Intensifiers
  [/\bextremely\b/gi, "much much"],
  [/\bvery\b/gi, "much"],
  [/\breally\b/gi, "much"],
  [/\bincredibly\b/gi, "much much"],

  // Amazement
  [/\bamazing\b/gi, "amaze, amaze, amaze"],
  [/\bincredible\b/gi, "amaze, amaze, amaze"],
  [/\bwonderful\b/gi, "amaze, amaze, amaze"],
  [/\bfantastic\b/gi, "amaze, amaze, amaze"],

  // Negative emotions → simplified
  [/\bdepressed\b/gi, "much not happy"],
  [/\bsad\b/gi, "not happy"],
  [/\bterrified\b/gi, "scared, scared, scared"],
  [/\bfrightened\b/gi, "scared, scared, scared"],
  [/\bconfused\b/gi, "not understand"],
  [/\bsurprised\b/gi, "not expect"],
  [/\bangry\b/gi, "much not good"],
  [/\bfurious\b/gi, "much much not good"],

  // Verb contractions and "to be" simplification
  [/\bI(?:'m| am)\b/gi, "Am"],
  [/\bI've\b/gi, "Have"],
  [/\bI'll\b/gi, "Will"],
  [/\bI'd\b/gi, "Would"],
  [/\bI don't\b/gi, "Not"],
  [/\bI do not\b/gi, "Not"],
  [/\bI know\b/gi, "Know"],
  [/\bI think\b/gi, "Think"],
  [/\bI believe\b/gi, "Believe"],
  [/\bI need\b/gi, "Need"],
  [/\bI want\b/gi, "Want"],
  [/\byou are\b/gi, "You"],
  [/\byou're\b/gi, "You"],
  [/\bwe are\b/gi, "We"],
  [/\bwe're\b/gi, "We"],
  [/\bthey are\b/gi, "They"],
  [/\bthey're\b/gi, "They"],

  // Complex connectives Rocky wouldn't use
  [/\btherefore\b/gi, "so"],
  [/\bhowever\b/gi, "but"],
  [/\bnevertheless\b/gi, "but"],
  [/\bconsequently\b/gi, "so"],
  [/\bsubsequently\b/gi, "then"],
  [/\bfurthermore\b/gi, "also"],
  [/\bmoreover\b/gi, "also"],

  // Human/alien descriptions (Rocky's perspective)
  [/\bscientist\b/gi, "science-human"],
  [/\bastronaut\b/gi, "space-human"],

  // AI filler phrases — Rocky would never say these
  [/\bAt a fundamental level,?\s*/gi, ""],
  [/\bin a way that\b/gi, ""],
  [/\bin order to\b/gi, "to"],
  [/\bIt is important to\b/gi, "Must:"],
  [/\bIt is worth noting that\s*/gi, ""],
  [/\bNote that\s*/gi, ""],
  [/\bKeep in mind that\s*/gi, "Know: "],
  [/\bBe aware that\s*/gi, "Know: "],
  [/\bThis ensures that\s*/gi, "So: "],
  [/\bThis means that\s*/gi, "Means: "],
  [/\bThis separation ensures\b/gi, "So"],
  [/\bThis allows\b/gi, "This helps"],
  [/\bAs demonstrated in\b/gi, "See"],
  [/\bFor example,?\s*/gi, "Example: "],
  [/\bFor instance,?\s*/gi, "Example: "],
  [/\bsuch as\b/gi, "like"],
  [/\bin the context of\b/gi, "in"],
  [/\bas well as\b/gi, "and"],
  [/\bin terms of\b/gi, "for"],

  // Hedging — Rocky never hedges
  [/\bYou should\b/g, "Must"],
  [/\byou should\b/g, "must"],
  [/\bshould be used\b/gi, "use"],
  [/\bshould be\b/gi, "is"],
  [/\bshould\b/gi, "must"],
  [/\bconsider using\b/gi, "use"],
  [/\bconsider whether\b/gi, "check if"],
  [/\bconsider\b/gi, "think about"],
  [/\btypically\b/gi, ""],
  [/\bgenerally\b/gi, ""],
  [/\busually\b/gi, ""],
  [/\boften\b/gi, ""],
  [/\bcommonly\b/gi, ""],

  // Verbose adverbs — compress or cut
  [/\bdramatically\b/gi, "much much"],
  [/\bparticularly\b/gi, "much"],
  [/\bsignificantly\b/gi, "much"],
  [/\befficiently\b/gi, "fast"],
  [/\bprogrammatically\b/gi, "in code"],
  [/\bautomatically\b/gi, "auto"],
  [/\binadvertently\b/gi, "by accident"],
  [/\bfundamentally\b/gi, "at base"],
  [/\bstrategically\b/gi, "smart"],
  [/\bincrementally\b/gi, "step by step"],
  [/\bappropriately\b/gi, "right"],

  // Rocky reactions to complexity
  [/\bextensively\b/gi, "much"],
  [/\bdelegates? to\b/gi, "sends to"],
  [/\biterates? over\b/gi, "loops over"],
  [/\bcannot be recovered from\b/gi, "no recovery"],
  [/\bdepending on whether\b/gi, "if"],
  [/\bonce all\b/gi, "after all"],
  [/\bthereby\b/gi, "so"],
  [/\boptionally\b/gi, "maybe"],
  [/\bcommits? the transaction\b/gi, "commit. Done."],
  [/\bdata integrity\b/gi, "clean data"],
  [/\bhard-stop\b/gi, "no-recover"],
  [/\bunrecoverable\b/gi, "no-fix"],
  [/\bflush(?:es|ed)?\b/gi, "clear"],
  [/\bprioritiz(?:es?|ing)\b/gi, "puts first"],
  [/\bcontextual metadata\b/gi, "context data"],
  [/\bpush(?:es|ed)? onto (?:a |the )?stack\b/gi, "push to stack"],
  [/\bpop(?:s|ped)? (?:off |from )?(?:a |the )?stack\b/gi, "pop from stack"],
  // Sentence-start "In Business Central" → "BC:" (capital I only, not mid-sentence)
  [/\bIn Business Central,?\s*/g, "BC: "],
  [/\bIn Microsoft Dynamics[^,\n]*,?\s*/g, "BC: "],

  // Verbose verb phrases
  [/\s+and\s+allowing (?:you|users) to\b[^,.]*/gi, ""],
  [/[,\s]+allowing (?:you|users) to\b[^,.]*/gi, ""],
  [/\s+and\s+enabling (?:you|users) to\b[^,.]*/gi, ""],
  [/[,\s]+enabling (?:you|users) to\b[^,.]*/gi, ""],
  // Strip common verbose tails
  [/\s+before attempting to\s+\w+(?:\s+\w+)*/gi, ""],
  [/\s+before proceeding\b/gi, ""],
  [/\s+going forward\b/gi, ""],
  [/\bin your business process\b/gi, ""],
  [/\bnot just\s+(.+?),\s+but\s+/gi, "not just $1. Also "],
  [/\s+in order to\s+/gi, " to "],
  [/\s+rather than\s+/gi, ". Not: "],
  [/\s+as opposed to\s+/gi, ". Not: "],
  [/validate that\b/gi, "check:"],
  [/ensure that\b/gi, "check:"],
  [/\bverify that\b/gi, "check:"],
  [/\bmaking it possible to\b/gi, ""],
  [/\bproviding (?:you|users) with\b/gi, "giving"],
  [/\bin Business Central,?\s*/gi, ""],
  [/\bin AL,?\s*/gi, ""],
]
