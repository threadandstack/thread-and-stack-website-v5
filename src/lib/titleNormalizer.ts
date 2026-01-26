// Common words that should remain lowercase (unless first word)
const LOWERCASE_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
  'at', 'by', 'in', 'of', 'on', 'to', 'up', 'as', 'it', 'is'
]);

// Known book titles for exact matching (normalized lowercase -> proper case)
const KNOWN_TITLES: Record<string, string> = {
  'the great gatsby': 'The Great Gatsby',
  'to kill a mockingbird': 'To Kill a Mockingbird',
  'pride and prejudice': 'Pride and Prejudice',
  '1984': '1984',
  'the catcher in the rye': 'The Catcher in the Rye',
  'lord of the flies': 'Lord of the Flies',
  'the lord of the rings': 'The Lord of the Rings',
  'harry potter': 'Harry Potter',
  'the hobbit': 'The Hobbit',
  'dune': 'Dune',
  'brave new world': 'Brave New World',
  'animal farm': 'Animal Farm',
  'the alchemist': 'The Alchemist',
  'the little prince': 'The Little Prince',
  'crime and punishment': 'Crime and Punishment',
  'war and peace': 'War and Peace',
  'anna karenina': 'Anna Karenina',
  'moby dick': 'Moby Dick',
  'moby-dick': 'Moby-Dick',
  'jane eyre': 'Jane Eyre',
  'wuthering heights': 'Wuthering Heights',
  'great expectations': 'Great Expectations',
  'a tale of two cities': 'A Tale of Two Cities',
  'the odyssey': 'The Odyssey',
  'the iliad': 'The Iliad',
  'don quixote': 'Don Quixote',
  'frankenstein': 'Frankenstein',
  'dracula': 'Dracula',
  'the picture of dorian gray': 'The Picture of Dorian Gray',
  'fahrenheit 451': 'Fahrenheit 451',
  'the hunger games': 'The Hunger Games',
  'twilight': 'Twilight',
  'the da vinci code': 'The Da Vinci Code',
  'gone girl': 'Gone Girl',
  'the girl with the dragon tattoo': 'The Girl with the Dragon Tattoo',
  'the kite runner': 'The Kite Runner',
  'life of pi': 'Life of Pi',
  'the book thief': 'The Book Thief',
  'the fault in our stars': 'The Fault in Our Stars',
  'divergent': 'Divergent',
  'the maze runner': 'The Maze Runner',
  'percy jackson': 'Percy Jackson',
  'ender\'s game': 'Ender\'s Game',
  'the chronicles of narnia': 'The Chronicles of Narnia',
  'a song of ice and fire': 'A Song of Ice and Fire',
  'game of thrones': 'Game of Thrones',
  'the handmaid\'s tale': 'The Handmaid\'s Tale',
  'slaughterhouse-five': 'Slaughterhouse-Five',
  'cat\'s cradle': 'Cat\'s Cradle',
  'breakfast of champions': 'Breakfast of Champions',
  'the shining': 'The Shining',
  'it': 'It',
  'misery': 'Misery',
  'the stand': 'The Stand',
  'pet sematary': 'Pet Sematary',
  'carrie': 'Carrie',
};

/**
 * Normalize a book title to proper title case
 * Uses known titles database for exact matches, otherwise applies title case rules
 */
export function normalizeTitle(input: string): string {
  if (!input) return input;
  
  const trimmed = input.trim();
  const lowercased = trimmed.toLowerCase();
  
  // Check for known title (exact match)
  if (KNOWN_TITLES[lowercased]) {
    return KNOWN_TITLES[lowercased];
  }
  
  // Check for partial matches (e.g., "harry potter and the..." should start with "Harry Potter")
  for (const [key, value] of Object.entries(KNOWN_TITLES)) {
    if (lowercased.startsWith(key)) {
      const remainder = trimmed.slice(key.length);
      return value + (remainder ? normalizeRemainder(remainder) : '');
    }
  }
  
  // Apply standard title case rules
  return toTitleCase(trimmed);
}

function normalizeRemainder(text: string): string {
  // Handle continuation of a title (e.g., " and the Sorcerer's Stone")
  return text.split(' ').map((word, index) => {
    const lower = word.toLowerCase();
    if (index === 0 && word === '') return '';
    if (LOWERCASE_WORDS.has(lower) && index > 0) return lower;
    return capitalize(word);
  }).join(' ');
}

function toTitleCase(text: string): string {
  return text.split(' ').map((word, index) => {
    const lower = word.toLowerCase();
    // First word always capitalized
    if (index === 0) return capitalize(word);
    // Articles/prepositions stay lowercase unless first
    if (LOWERCASE_WORDS.has(lower)) return lower;
    return capitalize(word);
  }).join(' ');
}

function capitalize(word: string): string {
  if (!word) return word;
  // Handle hyphenated words
  if (word.includes('-')) {
    return word.split('-').map(capitalize).join('-');
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Generate a cluster key from a title for deduplication
 * This creates a normalized key that groups similar titles together
 */
export function generateClusterKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/['']/g, "'") // Normalize apostrophes
    .replace(/[^\w\s']/g, '') // Remove punctuation except apostrophes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
