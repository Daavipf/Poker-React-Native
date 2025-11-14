import { card } from "@/types/card"
import { player } from "@/types/player"
import { constants } from "./constants"

export default class Player implements player {
  name: string
  chips: number
  currentBet: number
  hand: card[]
  type: "JOGADOR" | "IA"
  isFold: boolean
  isAllIn: boolean

  constructor(name: string, chips: number, type: "JOGADOR" | "IA") {
    this.name = name
    this.chips = chips
    this.currentBet = 0
    this.hand = []
    this.type = type
    this.isFold = false
    this.isAllIn = false
  }

  setHand(cards: card[]): void {
    this.hand = cards
  }

  fold(): void {
    this.isFold = true
    this.hand = []
  }

  allIn(): number {
    this.isAllIn = true
    const allInChips = this.chips
    this.chips = 0
    return allInChips
  }

  raise(currentBet: number): number {
    let realBetValue = currentBet + constants.RAISE_VALUE
    if (this.chips <= realBetValue) {
      const allInBet = this.allIn()
      this.currentBet += allInBet
      return allInBet
    }

    this.chips -= realBetValue
    this.currentBet += realBetValue

    return realBetValue
  }

  call(amount: number): number {
    let realBetValue = amount - this.currentBet
    if (this.chips <= realBetValue) {
      const allInBet = this.allIn()
      this.currentBet += allInBet
      return allInBet
    }

    this.chips -= realBetValue
    this.currentBet = amount

    return realBetValue
  }

  check(currentBet: number): void {
    if (this.currentBet !== currentBet) throw new Error("CHECK inválido: Aposta não coberta.")
  }

  clone(): player {
    const newPlayer = new Player(this.name, this.chips, this.type)
    newPlayer.hand = [...this.hand]
    newPlayer.isFold = this.isFold
    newPlayer.isAllIn = this.isAllIn
    newPlayer.currentBet = this.currentBet
    return newPlayer
  }
}
