import { card } from "@/types/card"
import { deck } from "@/types/deck"
import { iplayer } from "@/types/iplayer"
import { table } from "@/types/table"
import { constants } from "./constants"

export default class Table implements table {
  pot: number
  currentBet: number
  iCurrentPlayer: number
  iDealer: number
  iLastRaiser: number
  communityCards: card[]

  constructor() {
    this.pot = 0
    this.currentBet = 0
    this.iCurrentPlayer = 0
    this.iDealer = 0
    this.iLastRaiser = 0
    this.communityCards = []
  }

  addCards(cards: card[]): void {
    this.communityCards.push(...cards)
  }

  incrementPot(amount: number): void {
    this.pot += amount
  }

  setNextPlayer(players: iplayer[]): void {
    let iNextPlayer = (this.iCurrentPlayer + 1) % players.length

    while (players[iNextPlayer].isFold || players[iNextPlayer].isAllIn) {
      iNextPlayer = (iNextPlayer + 1) % players.length

      if (iNextPlayer === this.iCurrentPlayer) {
        this.iCurrentPlayer = iNextPlayer
        return
      }
    }

    this.iCurrentPlayer = iNextPlayer
  }

  setNextDealer(players: iplayer[]): void {
    let iNextPlayer = (this.iDealer + 1) % players.length

    this.iDealer = iNextPlayer
  }

  setNextRaiser(iPlayer: number): void {
    this.iLastRaiser = iPlayer
  }

  setDealerAndBlinds(newPlayers: iplayer[]): iplayer[] {
    const iDealer = this.iDealer
    let iSmallBlind = (iDealer + 1) % newPlayers.length
    let iBigBlind = (iDealer + 2) % newPlayers.length

    newPlayers[iSmallBlind].currentBet = constants.SMALL_BLIND
    newPlayers[iSmallBlind].chips -= constants.SMALL_BLIND
    this.incrementPot(constants.SMALL_BLIND)

    newPlayers[iBigBlind].currentBet = constants.BIG_BLIND
    newPlayers[iBigBlind].chips -= constants.BIG_BLIND
    this.incrementPot(constants.BIG_BLIND)

    // Assign last raiser
    this.currentBet = constants.BIG_BLIND
    this.iLastRaiser = iBigBlind

    return newPlayers
  }

  setPlayersHands(newPlayers: iplayer[], deck: deck): iplayer[] {
    newPlayers.map((player) => {
      player.hand = [deck.drawCard(), deck.drawCard()]
    })

    return newPlayers
  }

  clone(): table {
    const newTable = new Table()
    newTable.pot = this.pot
    newTable.iCurrentPlayer = this.iCurrentPlayer
    newTable.iDealer = this.iDealer
    newTable.iLastRaiser = this.iLastRaiser
    newTable.communityCards = [...this.communityCards]
    newTable.currentBet = this.currentBet
    return newTable
  }
}
