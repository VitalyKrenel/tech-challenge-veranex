import styled from 'styled-components';
import { CardDeck } from 'domain/cardDeck';

const GameProgressMessageLayout = styled.p``;
const GameRestartButton = styled.button`
  display: inline;
  background-color: transparent;
  border: none;
  padding: 0;

  font-weight: bold;
  font-style: italic;
`;

const GameProgressMessage = ({ remainingDeckSize }) => (
  <GameProgressMessageLayout>
    {CardDeck.checkIsPlayableCardDeck(remainingDeckSize) ? (
      <>Количество карт в колоде: {remainingDeckSize}</>
    ) : (
      <>
        Колода пуста.
        {' '}
        <GameRestartButton>Начать заново?</GameRestartButton>
      </>
    )}
  </GameProgressMessageLayout>
);

export { GameProgressMessage };