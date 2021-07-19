import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const DEFAULT_SCORE_INCREASE_ON_WIN = 1;
const DEFAULT_DECK_SIZE = 52;

const GameStateMessages = {
  IDLE: 'Ваша ставка',
  TURN_WIN: 'Вы выиграли',
  TURN_LOSE: 'Вы проиграли',
}

const checkCanPlay = (context) => context.cardDeckLength > context.currentCardIndex;

const makeWinTurn = assign({
  userScore: (context, event) => context.userScore + DEFAULT_SCORE_INCREASE_ON_WIN,
  currentCardIndex: (context, event) => context.currentCardIndex + 1,
  gameStateMessage: GameStateMessages.TURN_WIN,
});

const makeLoseTurn = assign({
  currentCardIndex: (context, event) => context.currentCardIndex + 1,
  gameStateMessage: GameStateMessages.TURN_LOSE,
});

const cardDeckGameMachine = createMachine({
  id: 'card-deck',
  initial: 'idle',
  context: {
    userScore: 0,
    remaningCardsAmount: DEFAULT_DECK_SIZE,
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
    }
  }
});

const useCardDeckGameMachine = () => {
  return useMachine(cardDeckGameMachine);
}

export { cardDeckGameMachine, useCardDeckGameMachine };