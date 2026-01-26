// Simple profanity filter - blocks common offensive words
const BLOCKED_WORDS = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'piss', 'dick', 'cock', 
  'pussy', 'bastard', 'slut', 'whore', 'cunt', 'fag', 'nigger', 'nigga',
  'retard', 'spic', 'chink', 'kike', 'wop', 'wetback', 'beaner',
  'faggot', 'dyke', 'tranny', 'shemale', 'twat', 'wanker', 'bollocks',
  'arsehole', 'asshole', 'motherfucker', 'fucker', 'bullshit', 'horseshit',
  'jackass', 'dumbass', 'dipshit', 'shithead', 'dickhead', 'fuckhead'
];

// Create regex patterns that catch variations (with numbers, special chars)
const createPattern = (word: string): RegExp => {
  // Replace common letter substitutions
  const escaped = word
    .replace(/a/gi, '[a@4]')
    .replace(/e/gi, '[e3]')
    .replace(/i/gi, '[i1!]')
    .replace(/o/gi, '[o0]')
    .replace(/s/gi, '[s$5]')
    .replace(/t/gi, '[t7]');
  
  return new RegExp(escaped, 'gi');
};

const patterns = BLOCKED_WORDS.map(createPattern);

export function containsProfanity(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[\s_-]/g, '');
  return patterns.some(pattern => pattern.test(normalized));
}

export function filterProfanity(text: string): { isClean: boolean; reason?: string } {
  if (containsProfanity(text)) {
    return { 
      isClean: false, 
      reason: "Please keep submissions friendly and appropriate for all audiences." 
    };
  }
  return { isClean: true };
}
