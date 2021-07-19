const doFetch = async (url) => {
  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  console.error('Fetch request did not succeed: ', { response });
  throw new Error('Fetch request did not succeed, see response in logs')
}

const fromRawCardDeck = ({ deck_id, remaining, shuffled }) => ({
  cardDeckId: deck_id,
  remaningCardsAmount: remaining,
  isShuffled: shuffled,
});

const createCardDeck = async () => doFetch('https://deckofcardsapi.com/api/deck/new/shuffle/').then(fromRawCardDeck);
const shuffleCardDeck = async ({ cardDeckId } = {}) => doFetch(`https://deckofcardsapi.com/api/deck/${cardDeckId}/shuffle/`).then(fromRawCardDeck);
const drawCard = async ({ cardDeckId }) => doFetch(`https://deckofcardsapi.com/api/deck/${cardDeckId}/draw`);

const CardDeckApi = {
  createCardDeck,
  shuffleCardDeck,
  drawCard,
};

export { CardDeckApi };
