import { gamePhase } from "@/types/gameState"

export interface DecisionContext {
  handStrength: number
  potOdds: number
  toCallAmount: number
  stackSize: number
  potSize: number
  phase: gamePhase
  activePlayers: number
}
