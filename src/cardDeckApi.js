const doFetch = async (url) => {
  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  console.error('Fetch request did not succeed: ', { response });
  return await doFetch(url);
}

const fromRawCardDeck = ({ deck_id, remaining, shuffled }) => ({
  id: deck_id,
  cardsAmount: remaining,
  isShuffled: shuffled,
});

const CardSuits = {
  CLUBS: 'CLUBS',
  HEARTS: 'HEARTS',
  DIAMONDS: 'DIAMONDS',
  SPADES: 'SPADES',
}

const colorsForSuits = {
  [CardSuits.CLUBS]: 'BLACK',
  [CardSuits.SPADES]: 'BLACK',
  [CardSuits.DIAMONDS]: 'RED',
  [CardSuits.HEARTS]: 'RED',
}

const fromRawDrawnCard = ({ cards, remaining: remainingCardsAmount }) => {
  const [card] = cards;

  if (cards.length === 0) {
    return {
      card: null,
      deck: {
        remainingCardsAmount: 0,
      },
    };
  }

  return {
    card: {
      imageSource: card.images.png,
      suit: card.suit,
      color: colorsForSuits[card.suit],
    },
    deck: {
      remainingCardsAmount,
    },
  };
};

const createCardDeck = async () => doFetch('https://deckofcardsapi.com/api/deck/new/shuffle/').then(fromRawCardDeck);
const shuffleCardDeck = async ({ cardDeckId } = {}) => doFetch(`https://deckofcardsapi.com/api/deck/${cardDeckId}/shuffle/`).then(fromRawCardDeck);
const drawCard = async ({ cardDeckId }) => doFetch(`https://deckofcardsapi.com/api/deck/${cardDeckId}/draw`).then(fromRawDrawnCard);

const CardDeckApi = {
  createCardDeck,
  shuffleCardDeck,
  drawCard,
};

export { CardDeckApi };
