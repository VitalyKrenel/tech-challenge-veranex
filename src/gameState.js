import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import { checkIsPlayableCardDeck } from 'domain/deckGameCases/checkIsPlayableCardDeck';
import { CardDeck } from 'domain/cardDeck';

const DEFAULT_SCORE_INCREASE_ON_WIN = 1;

const GameStateMessages = {
  IDLE: 'Ваша ставка',
  TURN_WIN: 'Вы выиграли',
  TURN_LOSE: 'Вы проиграли',
  GAME_COMPLETED: 'Ваш результат',
}

// TODO: Expose current deck to gameStateMachine to provide valid deck
const checkCanPlay = (context) => checkIsPlayableCardDeck({ remainingDeckSize: context.remainingDeckSize });

const makeWinTurn = assign({
  userScore: (context) => context.userScore + DEFAULT_SCORE_INCREASE_ON_WIN,
  remainingDeckSize: (context) => context.remainingDeckSize - 1,
  gameStateMessage: GameStateMessages.TURN_WIN,
});

const makeLoseTurn = assign({
  gameStateMessage: GameStateMessages.TURN_LOSE,
  remainingDeckSize: (context) => context.remainingDeckSize - 1,
});

const completeGame = assign({
  gameStateMessage: (context) => `${GameStateMessages.GAME_COMPLETED}: ${context.userScore}`,
  remainingDeckSize: () => 0,
});

const cardDeckGameMachine = createMachine({
  id: 'card-deck',
  initial: 'idle',
  context: {
    userScore: 0,
    remainingDeckSize: CardDeck.DEFAULT_DECK_SIZE,
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