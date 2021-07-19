import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const DEFAULT_SCORE_INCREASE_ON_WIN = 1;

const GameStateMessages = {
  IDLE: 'Ваша ставка',
  TURN_WIN: 'Вы выиграли',
  TURN_LOSE: 'Вы проиграли',
  GAME_COMPLETED: 'Ваш результат',
}

const checkCanPlay = (context, event) => event.remainingCardsAmount > 0;

const makeWinTurn = assign({
  userScore: (context) => context.userScore + DEFAULT_SCORE_INCREASE_ON_WIN,
  remainingCardsAmount: (context, event) => event.remainingCardsAmount,
  gameStateMessage: GameStateMessages.TURN_WIN,
});

const makeLoseTurn = assign({
  remainingCardsAmount: (context, event) => event.remainingCardsAmount,
  gameStateMessage: GameStateMessages.TURN_LOSE,
});

const completeGame = assign({
  gameStateMessage: (context) => `${GameStateMessages.GAME_COMPLETED}: ${context.userScore}`,
});

const cardDeckGameMachine = createMachine({
  id: 'card-deck',
  initial: 'idle',
  context: {
    userScore: 0,
    gameStateMessage: GameStateMessages.IDLE,
  },
  states: {
    idle: {
      on: {
        WIN: {
          target: 'turn_win',
          actions: makeWinTurn,
        },
        LOSE: {
          target: 'turn_lose',
          actions: makeLoseTurn,
        },
      }
    },

    turn_win: {
      on: {
        WIN: [
          {
            target: 'turn_win',
            actions: makeWinTurn,
            cond: checkCanPlay,
          },
          {
            target: 'completed',
          }
        ],
        LOSE: [
          {
            target: 'turn_lose',
            actions: makeLoseTurn,
            cond: checkCanPlay,
          },
          {
            target: 'completed',
          }
        ],
      },
    },

    turn_lose: {
      on: {
        WIN: [
          {
            target: 'turn_win',
            actions: makeWinTurn,
            cond: checkCanPlay,
          },
          {
            target: 'completed',
          },
        ],
        LOSE: [
          {
            target: 'turn_lose',
            actions: makeLoseTurn,
            cond: checkCanPlay,
          },
          {
            target: 'completed',
          },
        ],
      }
    },

    completed: {
      type: 'final',
      entry: completeGame,
    }
  }
});

const useCardDeckGameMachine = () => {
  return useMachine(cardDeckGameMachine);
}

export { cardDeckGameMachine, useCardDeckGameMachine };