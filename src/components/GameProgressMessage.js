import styled from 'styled-components';
import { checkIsPlayableCardDeck } from 'domain/deckGameCases/checkIsPlayableCardDeck';

const GameProgressMessageLayout = styled.p``;
const GameRestartButton = styled.button`
  display: inline;
  background-color: transparent;
  border: none;
  padding: 0;

  font-weight: bold;
  font-style: italic;
`;

const GameProgressMessage = ({ remainingDeckSize, onRestartClick }) => (
  <GameProgressMessageLayout>
    {checkIsPlayableCardDeck({ remainingDeckSize }) ? (
      <>Количество карт в колоде: {remainingDeckSize}</>
    ) : (
      <>
        Колода пуста.
        {' '}
        <GameRestartButton onClick={onRestartClick}>Начать заново?</GameRestartButton>
      </>
    )}
  </GameProgressMessageLayout>
);

export { GameProgressMessage };