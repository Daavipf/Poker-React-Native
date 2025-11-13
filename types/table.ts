import { card } from "./card"
import { deck } from "./deck"
import { iplayer } from "./iplayer"

export interface table {
  pot: number
  currentBet: number
  iCurrentPlayer: number
  iDealer: number
  iLastRaiser: number
  communityCards: card[]
  addCards: (cards: card[]) => void
  incrementPot: (amount: number) => void
  setNextPlayer: (players: iplayer[]) => void
  setNextDealer: (players: iplayer[]) => void
  setNextRaiser: (iPlayer: number) => void
  setDealerAndBlinds: (newPlayers: iplayer[]) => iplayer[]
  setPlayersHands: (newPlayers: iplayer[], deck: deck) => iplayer[]
  clone: () => table
}
