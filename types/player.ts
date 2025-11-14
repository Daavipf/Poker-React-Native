import { card } from "@/types/card"

export interface player {
  name: string
  chips: number
  currentBet: number
  hand: card[]
  type: "JOGADOR" | "IA"
  isFold: boolean
  isAllIn: boolean
  setHand: (cards: card[]) => void
  fold: () => void
  allIn: () => number
  raise: (currentBet: number) => number
  call: (amount: number) => number
  check: (currentBet: number) => void
  clone: () => player
}
