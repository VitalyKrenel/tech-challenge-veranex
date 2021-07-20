const DEFAULT_DECK_SIZE = 52;

const createCardDeck = ({ id, deckSize, remainingDeckSize = deckSize, isShuffled }) => ({
  id,
  deckSize,
  remainingDeckSize,
  isShuffled,
});

const fromRaw = ({ deck_id, remaining, shuffled = false }) => createCardDeck({
  id: deck_id,
  deckSize: DEFAULT_DECK_SIZE ,
  remainingDeckSize: remaining,
  isShuffled: shuffled,
});

const CardDeck = {
  createCardDeck,
  fromRaw,
  DEFAULT_DECK_SIZE,
};

export { CardDeck };