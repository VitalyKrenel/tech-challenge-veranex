import { CardDeck } from 'domain/cardDeck';
import { Card } from 'domain/card';

const doFetch = async (url) => {
  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  // Retry fetch request when Card Deck API is returning 500 error
  console.error('Fetch request did not succeed: ', { response });
  return await doFetch(url);
}

const createCardDeck = async () => doFetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
  .then(CardDeck.fromRaw);

  const shuffleCardDeck = async ({ cardDeckId } = {}) => doFetch(`https://deckofcardsapi.com/api/deck/${cardDeckId}/shuffle/`)
  .then(CardDeck.fromRaw);

const drawCard = async ({ cardDeckId }) => doFetch(`https://deckofcardsapi.com/api/deck/${cardDeckId}/draw`)
  .then(Card.fromRawDeckWithCards);

const CardDeckApi = {
  createCardDeck,
  shuffleCardDeck,
  drawCard,
};

export { CardDeckApi };
