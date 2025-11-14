import { deck } from "./deck"
import { player } from "./player"
import { table } from "./table"

export interface gameState {
  deck: deck
  players: player[]
  phase: gamePhase
  table: table
  message: string
}

export type gamePhase = "PREFLOP" | "FLOP" | "TURN" | "RIVER" | "SHOWDOWN"
