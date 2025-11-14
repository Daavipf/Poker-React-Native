import { card } from "./card"
import { deck } from "./deck"
import { player } from "./player"

export interface table {
  pot: number
  currentBet: number
  iCurrentPlayer: number
  iDealer: number
  iLastRaiser: number
  communityCards: card[]
  addCards: (cards: card[]) => void
  incrementPot: (amount: number) => void
  setNextPlayer: (players: player[]) => void
  setNextDealer: (players: player[]) => void
  setNextRaiser: (Player: number) => void
  setDealerAndBlinds: (newPlayers: player[]) => player[]
  setPlayersHands: (newPlayers: player[], deck: deck) => player[]
  clone: () => table
}
