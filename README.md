## Cards Deck on React
Задача: Написать небольшую карточную игру на React

Для имитации колоды карт и розыгрыша Вы будете использовать следующий API — https://deckofcardsapi.com/.
Пройдя по ссылке, можно получить исчерпывающую информацию об API.

Пример запроса:
https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2

Совет: Заменив ${deck_id} на значение new, вы перетасуете колоду и отрисуете карту из этой колоды.

Суть игры:
Игрок делает ставки либо на красную, либо на черную колоду, и, если вытянутая карта будет выбранного цвета, то игрок получает очко, в противном случае — ничего.

UI:
Экран игры содержит следующие разделы:
1. Текущее состояние игры
2. Карта — разыгранная ранее или первоначальная, плейсхолдер под карту.
3. Две кнопки — красного (Черви, Бубны) и черного (Трефы, Пики) цвета
4. Количество карт, оставшихся в колоде; Кнопка для решафла колоды.

Возможные состояния игры:
1. Ваша ставка
2. Вы выиграли
3. Вы проиграли
4. Ваш счет: ${won}/52

Размеры плейсхолдера\карты — 226x314 (px)


## Decomposition
```
Game Screen
  App Action Label
    -> Your turn label
    -> You win label
    -> You lose label
    -> Your Result #/# label
  Card
    -> Unknown card placeholder
    -> Card with image
  Action Buttons
    -> [Red] Stake on Red card
    -> [Black] Stake on Black card
  CardDeckStatus
    -> # cards in Deck
    -> Empty card deck
      -> Restart Button
```

Scenarios
  1. Start Game
    - Deck has 52 cards
    - User clicks on [Red] or [Black] button
    - Unknown card placeholder is replaced with random card

    Code:
      - Request new cards deck using
      https://deckofcardsapi.com/api/deck/new/
      - Store card deck id in the store
      - Request a list of cards for this card deck using
      https://deckofcardsapi.com/api/deck/<<deck id>>/draw/?count=52

  2. Stake on Card
    - Receive user's choice
    - Take the deck of card
    - Get the next card from the top of the deck
    - Compare user's choice and the top card
    - If match, add points to user score AND draw "You win" label

    Code:
      - handle user stake event
      - get card under currentCardIndex index
      - compare received input and deck[currentCardIndex]
      - calculate result (wether the guess is correct)
      - add points (0 or 1) to user score
      - decrease the number of available cards in the deck
      - check whether there are more available cards
        - if not, go to state scenario 3

  3. Finish game
      - draw the score on the screen
      - disable the action buttons
      - draw the restart