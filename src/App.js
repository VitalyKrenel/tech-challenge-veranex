import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useCardDeckGameMachine } from './gameState';
import { CardDeckApi } from './cardDeckApi';
import { LoadingIndicator } from './components/LoadingIndicator';
import { AppLayout } from './components/AppLayout';

const GameContainer = styled.div`
  width: 226px;
`;

const GameStateLabel = styled.p`
  margin: 0 0 36px;

  text-align: center;
  font-size: 24px;
`;

const GameCardContainer = styled.div`
  position: relative;
  margin-bottom: 36px;
  height: 314px;

  ${({ shouldUsePlaceholder }) => shouldUsePlaceholder && css`
    background-color: ${cardPlaceholderBgColor};

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      font-size: 72px;
      font-weight: bold;
      content: '?';
    }
  `}
`;

const cardPlaceholderBgColor = '#D8D8D8';

const GameCard = styled.img`
  width: 100%;
  height: 100%;
`;

const actionButtonColor = '#fff';

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 24px;
`;

const blackActionButtonColor = '#000'
const redActionButtonColor = '#DF2A2A';

const ActionButton = styled.button`
  width: 100px;
  padding: 4px;

  background-color: ${blackActionButtonColor};

  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: ${actionButtonColor};
`;

const StakeRedActionButton = styled(ActionButton)`
  background-color: ${redActionButtonColor};
`;

const StakeBlackActionButton = styled(ActionButton)``;

const GameProgressMessage = styled.p``;
const GameRestartButton = styled.button`
  display: inline;
  background-color: transparent;
  border: none;
  padding: 0;

  font-weight: bold;
  font-style: italic;
`;

const checkIsPlayableCardDeck = (remainingDeckSize) => remainingDeckSize > 0;

const App = () => {
  const [isCardDeckFetching, setIsCardDeckFetching] = useState(true);
  const [cardDeckId, setCardDeckId] = useState(null);
  const [lastDrawnCard, setLastDrawnCard] = useState(null);

  const [currentState, sendEvent] = useCardDeckGameMachine();
  const { remainingDeckSize, gameStateMessage } = currentState.context;

  const chooseCard = async ({ cardColor } = {}) => {
    const { card: drawnCard } = await CardDeckApi.drawCard({ cardDeckId });
    setLastDrawnCard(drawnCard);

    if (drawnCard.color === cardColor) {
      sendEvent({ type: 'WIN' });
      return;
    }

    sendEvent({ type: 'LOSE' });
  }

  useEffect(() => {
    const initGame = async () => {
      const cardDeck = await CardDeckApi.createCardDeck();

      setCardDeckId(cardDeck.id);
      setIsCardDeckFetching(false);
    };

    initGame();
  }, []);


  return (
    <AppLayout loadingComponent={LoadingIndicator} isAppLoading={isCardDeckFetching}>
      <GameContainer>
        <GameStateLabel>
          {gameStateMessage}
        </GameStateLabel>
        <GameCardContainer shouldUsePlaceholder={lastDrawnCard === null}>
          <GameCard src={lastDrawnCard?.imageSource}/>
        </GameCardContainer>
        <ActionButtonsContainer>
          <StakeRedActionButton onClick={() => chooseCard({ cardColor: 'RED' })}>Red</StakeRedActionButton>
          <StakeBlackActionButton onClick={() => chooseCard({ cardColor: 'BLACK' })}>Black</StakeBlackActionButton>
        </ActionButtonsContainer>
      </GameContainer>
      {checkIsPlayableCardDeck(remainingDeckSize) ? (
        <GameProgressMessage>Количество карт в колоде: {remainingDeckSize}</GameProgressMessage>
      ) : (
        <GameProgressMessage>
          Колода пуста.
          {' '}
          <GameRestartButton>Начать заново?</GameRestartButton>
        </GameProgressMessage>
      )}
    </AppLayout>
  )
};

export { App };
