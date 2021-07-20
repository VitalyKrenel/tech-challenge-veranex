import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useCardDeckGameMachine } from './gameState';
import { CardDeckApi } from './cardDeckApi';

import { checkDidPlayerBetWin } from 'domain/deckGameCases/checkDidPlayerBetWin';

import { LoadingIndicator } from './components/LoadingIndicator';
import { AppLayout } from './components/AppLayout';
import { GameProgressMessage } from './components/GameProgressMessage';

import { checkIsDeckGameCompleted } from 'domain/deckGameCases/checkIsDeckGameCompleted';

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

const BetRedActionButton = styled(ActionButton)`
  background-color: ${redActionButtonColor};
`;

const BetBlackActionButton = styled(ActionButton)``;

const useCardDeck = () => {
  const [isCardDeckFetching, setIsCardDeckFetching] = useState(true);
  const [cardDeckId, setCardDeckId] = useState(null);

  useEffect(() => {
    const fetchCardDeck = async () => {
      const cardDeck = await CardDeckApi.createCardDeck();

      setCardDeckId(cardDeck.id);
      setIsCardDeckFetching(false);
    };

    fetchCardDeck();
  }, []);

  return {
    cardDeckId,
    isCardDeckFetching,
  };
}

const App = () => {
  const [lastDrawnCard, setLastDrawnCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { cardDeckId, isCardDeckFetching } = useCardDeck();

  const [cardDeckGameCurrentState, sendEvent] = useCardDeckGameMachine();
  const { remainingDeckSize, gameStateMessage } = cardDeckGameCurrentState.context;
  console.log(cardDeckGameCurrentState.value);

  const isBetActionDisabled = isDrawing || checkIsDeckGameCompleted(cardDeckGameCurrentState);


  const placeBetOnCardColor = async ({ playerChoiceCardColor } = {}) => {
    // TODO: Replace isDrawing with 'DRAWING' state machine node.
    // isDrawing preventing app crash when user bets when deck is empty
    // but we don't know that as the last drawing request yet to be finished
    setIsDrawing(true);
    const drawnCard = await CardDeckApi.drawCard({ cardDeckId });
    setLastDrawnCard(drawnCard);
    setIsDrawing(false);

    if (checkDidPlayerBetWin(playerChoiceCardColor, drawnCard)) {
      sendEvent({ type: 'WIN' });
      return;
    }

    sendEvent({ type: 'LOSE' });
  }

  const restartCardDeckGame = async () => {
    setLastDrawnCard(null);
    await CardDeckApi.shuffleCardDeck({ cardDeckId });
    sendEvent({ type: 'RESET' })
  };

  return (
    <AppLayout loadingComponent={LoadingIndicator} isAppLoading={isCardDeckFetching}>
      <GameContainer>
        <GameStateLabel>
          {gameStateMessage}
        </GameStateLabel>
        <GameCardContainer shouldUsePlaceholder={lastDrawnCard === null}>
          {lastDrawnCard && (
            <GameCard src={lastDrawnCard.imageSource}/>
          )}
        </GameCardContainer>
        <ActionButtonsContainer>
          <BetRedActionButton
            disabled={isBetActionDisabled}
            onClick={() => placeBetOnCardColor({ playerChoiceCardColor: 'RED' })}
          >
            Red
          </BetRedActionButton>
          <BetBlackActionButton
            disabled={isBetActionDisabled}
            onClick={() => placeBetOnCardColor({ playerChoiceCardColor: 'BLACK' })}
          >
            Black
          </BetBlackActionButton>
        </ActionButtonsContainer>
      </GameContainer>
      <GameProgressMessage remainingDeckSize={remainingDeckSize} onRestartClick={restartCardDeckGame} />
    </AppLayout>
  )
};

export { App };
