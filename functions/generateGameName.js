const adjectives = [
  "Cursed",
  "Dangerous",
  "Lost",
  "Electric",
  "Invisible",
  "Forbidden",
  "Explosive",
  "Chaotic",
  "Fast",
  "Broken",
  "Ultimate",
  "Revenge",
  "Midnight",
  "Galactic",
  "Shattered",
];

const movieWords = [
  "Goblin",
  "Popcorn",
  "Blockbuster",
  "Critic",
  "Sequel",
  "Spoiler",
  "Oscar",
  "Couch",
  "Director",
  "Franchise",
  "Tomato",
  "VHS",
  "Cinema",
  "Screenplay",
  "Rating",
];

const endings = [
  "Returns",
  "Reloaded",
  "Strikes Back",
  "Forever",
  "Part II",
  "Origins",
  "vs The World",
  "in Space",
  "Unleashed",
  "of Doom",
  "Resurrection",
  "The Reckoning",
];

export function generateGameName() {
  const adjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];

  const movieWord =
    movieWords[Math.floor(Math.random() * movieWords.length)];

  const ending =
    endings[Math.floor(Math.random() * endings.length)];

  return `${adjective} ${movieWord} ${ending}`;
}