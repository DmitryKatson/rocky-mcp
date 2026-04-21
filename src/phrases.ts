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
]
