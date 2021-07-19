import { useEffect, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useCardDeckGameMachine } from './gameState';
import { CardDeckApi } from './cardDeckApi';

const AppDefaultStyles = createGlobalStyle`
  html {
    font-family: Roboto, sans-serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }

  *,
  *:after,
  *:before {
    box-sizing: inherit;
  }
`;

const appBgColor = '#427937';
const appPrimaryColor = '#000000';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 45px;
  width: 100%;
  height: 100vh;

  background-color: ${appBgColor};
  color: ${appPrimaryColor};
`;

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

const CardDeckStatusLabel = styled.p``;
const GameRestartButton = styled.button`
  display: inline;
  background-color: transparent;
  border: none;
  padding: 0;

  font-weight: bold;
  font-style: italic;
`;

const App = () => {
  const [isCardDeckFetching, setIsCardDeckFetching] = useState(true);
  const [cardDeckId, setCardDeckId] = useState(null);
  const [lastDrawnCard, setLastDrawnCard] = useState(null);

  const [currentState, sendEvent] = useCardDeckGameMachine();
  const { remainingCardsAmount, gameStateMessage } = currentState.context;

  const chooseCard = async ({ cardColor } = {}) => {
    const { card: drawnCard, deck } = await CardDeckApi.drawCard({ cardDeckId });
    setLastDrawnCard(drawnCard, deck.remainingCardsAmount);

    if (drawnCard.color === cardColor) {
      sendEvent({ type: 'WIN', remainingCardsAmount: deck.remainingCardsAmount });
      return;
    }

    sendEvent({ type: 'LOSE', remainingCardsAmount: deck.remainingCardsAmount });
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
    <>
    <AppDefaultStyles/>
    <AppLayout>
      {isCardDeckFetching ? (
        <p>Загружаем колоду...</p>
      ) : (
        <>
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
          <CardDeckStatusLabel>
            {remainingCardsAmount > 0 ? (
              <>Количество карт в колоде: {remainingCardsAmount}</>
            ) : (
              <>Колода пуста. <GameRestartButton>Начать заново?</GameRestartButton></>
            )}
          </CardDeckStatusLabel>
        </>
      )}

    </AppLayout>
    </>
  )
};

export { App };
