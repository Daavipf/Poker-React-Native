import { card } from "@/types/card"

export interface player {
  name: string
  chips: number
  currentBet: number
  hand: card[]
  type: "JOGADOR" | "IA"
  role: "DEALER" | "SMALL_BLIND" | "BIG_BLIND" | undefined
  isFold: boolean
  isAllIn: boolean
  hasMoved: boolean
  setHand: (cards: card[]) => void
  fold: () => void
  allIn: () => number
  raise: (tableCurrentBet: number, amount: number) => number
  call: (amount: number) => number
  check: (currentBet: number) => void
  clone: () => player
}
