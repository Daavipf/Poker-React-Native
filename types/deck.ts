import { card } from "./card"

export interface deck {
  deck: card[]
  iTopCard: number
  drawCard: () => card
  clone: () => deck
}
