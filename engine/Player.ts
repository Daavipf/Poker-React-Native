import { card } from "@/types/card"
import { player } from "@/types/player"

export default class Player implements player {
  name: string
  chips: number
  currentBet: number
  hand: card[]
  type: "JOGADOR" | "IA"
  role: "DEALER" | "SMALL_BLIND" | "BIG_BLIND" | undefined
  isFold: boolean
  isAllIn: boolean
  hasMoved: boolean

  constructor(name: string, chips: number, type: "JOGADOR" | "IA") {
    this.name = name
    this.chips = chips
    this.currentBet = 0
    this.hand = []
    this.type = type
    this.isFold = false
    this.isAllIn = false
    this.hasMoved = false
  }

  setHand(cards: card[]): void {
    this.hand = cards
  }

  fold(): void {
    this.isFold = true
    this.hand = []
    this.hasMoved = true
  }

  allIn(): number {
    this.isAllIn = true
    const allInChips = this.chips
    this.chips = 0
    this.hasMoved = true
    return allInChips
  }

  raise(tableCurrentBet: number, amount: number): number {
    let realBetValue = tableCurrentBet + amount + this.currentBet
    if (this.chips <= realBetValue) {
      const allInBet = this.allIn()
      this.currentBet += allInBet
      return allInBet
    }

    this.chips -= realBetValue
    this.currentBet += realBetValue
    this.hasMoved = true

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
    this.hasMoved = true

    return realBetValue
  }

  check(tableCurrentBet: number): void {
    if (this.currentBet < tableCurrentBet) throw new Error("CHECK inválido: Aposta não coberta.")
    this.hasMoved = true
  }

  clone(): player {
    const newPlayer = new Player(this.name, this.chips, this.type)
    newPlayer.hand = [...this.hand]
    newPlayer.isFold = this.isFold
    newPlayer.isAllIn = this.isAllIn
    newPlayer.hasMoved = this.hasMoved
    newPlayer.currentBet = this.currentBet
    newPlayer.role = this.role
    return newPlayer
  }
}
