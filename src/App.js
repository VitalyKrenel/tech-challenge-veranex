import styled, { createGlobalStyle } from 'styled-components';
import { useCardDeckGameMachine } from './gameState';

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

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-size: 72px;
    font-weight: bold;
    content: '?';
  }
`;

const cardPlaceholderBgColor = '#D8D8D8';

const GameCard = styled.img`
  width: 100%;
  height: 314px;
  background-color: ${cardPlaceholderBgColor};
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
  const [currentState, sendEvent] = useCardDeckGameMachine();
  const { gameStateMessage } = currentState.context;
  console.log(currentState.context)

  const handleUserCardChoice = () => sendEvent({ type: Math.random() > 0.5 ? 'LOSE' : 'WIN' });

  return (
    <>
    <AppDefaultStyles/>
    <AppLayout>
      <GameContainer>
        <GameStateLabel>
          {gameStateMessage}
        </GameStateLabel>
        <GameCardContainer>
          <GameCard />
        </GameCardContainer>
        <ActionButtonsContainer>
          <StakeRedActionButton onClick={handleUserCardChoice}>Red</StakeRedActionButton>
          <StakeBlackActionButton onClick={handleUserCardChoice}>Black</StakeBlackActionButton>
        </ActionButtonsContainer>
      </GameContainer>
      <CardDeckStatusLabel>
        Колода пуста. <GameRestartButton>Начать заново?</GameRestartButton>
      </CardDeckStatusLabel>
    </AppLayout>
    </>
  )
};

export { App };
