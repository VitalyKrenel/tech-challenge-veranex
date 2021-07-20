import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import { checkIsPlayableCardDeck } from 'domain/deckGameCases/checkIsPlayableCardDeck';

import { CardDeck } from 'domain/cardDeck';

const DEFAULT_SCORE_INCREASE_ON_WIN = 1;

// Transient transition @see https://xstate.js.org/docs/guides/transitions.html#transient-transitions
const TRANSINIENT_EVENT = '';

const GameStateMessages = {
  IDLE: 'Ваша ставка',
  TURN_WIN: 'Вы выиграли',
  TURN_LOSE: 'Вы проиграли',
  GAME_COMPLETED: 'Ваш результат',
}

// TODO: Expose current deck to gameStateMachine to provide valid deck
const checkCannotPlay = (context) => !checkIsPlayableCardDeck({ remainingDeckSize: context.remainingDeckSize });

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

const defaultGameContext = {
  userScore: 0,
  remainingDeckSize: CardDeck.DEFAULT_DECK_SIZE,
  gameStateMessage: GameStateMessages.IDLE,
};

const cardDeckGameMachine = createMachine({
  id: 'card-deck',
  initial: 'idle',
  context: defaultGameContext,
  on: {
    RESET: {
      target: '.idle',
      actions: assign(() => defaultGameContext),
    }
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
        [TRANSINIENT_EVENT]: [
          { target: 'completed', cond: checkCannotPlay },
        ],
        WIN: [
          {
            target: 'turn_win',
            actions: makeWinTurn,
          }
        ],
        LOSE: [
          {
            target: 'turn_lose',
            actions:  makeLoseTurn,
          }
        ],
      },
    },

    turn_lose: {
      on: {
        [TRANSINIENT_EVENT]: [
          { target: 'completed', cond: checkCannotPlay },
        ],
        WIN: [
          {
            target: 'turn_win',
            actions: makeWinTurn,
          }
        ],
        LOSE: [
          {
            target: 'turn_lose',
            actions: makeLoseTurn,
          }
        ],
      }
    },

    completed: {
      entry: completeGame,
    }
  }
});

const useCardDeckGameMachine = () => {
  const [currentGameState, sendEvent] = useMachine(cardDeckGameMachine);

  return [currentGameState, sendEvent]
}

export { cardDeckGameMachine, useCardDeckGameMachine };