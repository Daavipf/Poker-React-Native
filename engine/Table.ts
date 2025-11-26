import { card } from "@/types/card"
import { deck } from "@/types/deck"
import { player } from "@/types/player"
import { table } from "@/types/table"
import { constants } from "./constants"
import HandComparator from "./HandComparator"

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

  incrementCurrentBet(amount: number): void {
    this.currentBet += amount
  }

  resetCurrentBet() {
    this.currentBet = 0
  }

  rotateToNextPlayer(players: player[]): void {
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

  setNextActivePlayerAfterDealer(players: player[]) {
    let iNextPlayer = (this.iDealer + 1) % players.length

    while (players[iNextPlayer].isFold || players[iNextPlayer].isAllIn) {
      iNextPlayer = (iNextPlayer + 1) % players.length

      if (iNextPlayer === this.iCurrentPlayer) {
        this.iCurrentPlayer = iNextPlayer
        return
      }
    }

    this.iCurrentPlayer = iNextPlayer
  }

  setNextDealer(players: player[]): void {
    let iNextPlayer = (this.iDealer + 1) % players.length

    this.iDealer = iNextPlayer
  }

  setNextRaiser(iPlayer: number): void {
    this.iLastRaiser = iPlayer
  }

  setDealerAndBlinds(newPlayers: player[]): player[] {
    let players = this.resetPlayersRoles(newPlayers)

    const iDealer = this.iDealer
    let iSmallBlind = (iDealer + 1) % players.length
    let iBigBlind = (iDealer + 2) % players.length

    players[iSmallBlind].currentBet = constants.SMALL_BLIND
    players[iSmallBlind].chips -= constants.SMALL_BLIND
    players[iSmallBlind].role = "SMALL_BLIND"
    this.incrementPot(constants.SMALL_BLIND)

    players[iBigBlind].currentBet = constants.BIG_BLIND
    players[iBigBlind].chips -= constants.BIG_BLIND
    players[iBigBlind].role = "BIG_BLIND"
    this.incrementPot(constants.BIG_BLIND)

    players[iDealer].role = "DEALER"

    this.currentBet = constants.BIG_BLIND
    this.setNextRaiser(iBigBlind)

    this.assignPlayerUnderTheGun(iBigBlind, players.length)

    return players
  }

  private resetPlayersRoles(players: player[]): player[] {
    let newPlayers = [...players]
    for (let i = 0; i < newPlayers.length; i++) {
      newPlayers[i].role = undefined
    }
    return newPlayers
  }

  private assignPlayerUnderTheGun(iBigBlind: number, playersLength: number) {
    this.iCurrentPlayer = (iBigBlind + 1) % playersLength
  }

  setPlayersHands(newPlayers: player[], deck: deck): player[] {
    newPlayers.map((player) => {
      player.hand = [deck.drawCard(), deck.drawCard()]
    })

    return newPlayers
  }

  // TODO: implementar logica de side-pot
  evaluateWinner(players: player[]): number {
    let hands = players.map((p) => {
      return [...p.hand, ...this.communityCards]
    })
    let iWinner = HandComparator.getWinner(hands)

    return iWinner
  }

  distributePot(players: player[], iWinner: number): void {
    if (iWinner >= 0 && iWinner < players.length) {
      let winner = players[iWinner]
      winner.chips += this.pot
      this.pot = 0
    }
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
