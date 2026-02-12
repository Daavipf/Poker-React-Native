import { card } from "@/types/card"
import { player } from "@/types/player"
import { AIArchetype } from "./AI/AIProfile"

export default class Player implements player {
  name: string
  chips: number
  currentBet: number
  hand: card[]
  type: "JOGADOR" | "IA"
  role: "DEALER" | "SMALL_BLIND" | "BIG_BLIND" | undefined
  isFold: boolean
  isAllIn: boolean
  isBusted: boolean
  hasMoved: boolean
  archetype?: AIArchetype
  seatIndex: number

  constructor(name: string, chips: number, type: "JOGADOR" | "IA", seatIndex: number, archetype?: AIArchetype) {
    this.name = name
    this.chips = chips
    this.currentBet = 0
    this.hand = []
    this.type = type
    this.isFold = false
    this.isAllIn = false
    this.isBusted = false
    this.hasMoved = false
    this.archetype = archetype
    this.seatIndex = seatIndex
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

  out(): void {
    this.isBusted = true
  }

  raise(tableCurrentBet: number, amount: number): number {
    let realBetValue = tableCurrentBet + amount
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
    const newPlayer = new Player(this.name, this.chips, this.type, this.seatIndex, this.archetype)
    newPlayer.hand = [...this.hand]
    newPlayer.isFold = this.isFold
    newPlayer.isAllIn = this.isAllIn
    newPlayer.isBusted = this.isBusted
    newPlayer.hasMoved = this.hasMoved
    newPlayer.currentBet = this.currentBet
    newPlayer.role = this.role
    return newPlayer
  }
}
