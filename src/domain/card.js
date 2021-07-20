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

const createCard = ({ suit, imageSource, }) => ({
  imageSource,
  suit,
  color: colorsForSuits[suit],
});

const fromRaw = ({ suit, images }) => createCard({
  imageSource: images.png,
  suit,
});

const fromRawDeckWithCards = ({ cards }) => {
  const [card] = cards;
  const hasAnyDrawnCard = cards.length !== 0;

  console.log({ drawnCardFromRaw: card });

  return hasAnyDrawnCard ? Card.fromRaw(card) : null;
};

const Card = {
  createCard,
  fromRaw,
  fromRawDeckWithCards,
};

export { Card };