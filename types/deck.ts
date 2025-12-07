import { card } from "./card"

export interface deck {
  deck: card[]
  iTopCard: number
  restartDeck: () => void
  drawCard: () => card
  clone: () => deck
}
