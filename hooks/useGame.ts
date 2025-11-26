import Deck from "@/engine/Deck"
import { gameReducer } from "@/engine/gameReducer"
import Player from "@/engine/Player"
import Table from "@/engine/Table"
import { gameState } from "@/types/gameState"
import { useReducer } from "react"

const initialState: gameState = {
  deck: new Deck(),
  table: new Table(),
  phase: "PREFLOP",
  message: "Pré-jogo",
  players: [new Player("Jogador", 1000, "JOGADOR"), new Player("IA 1", 1000, "IA"), new Player("IA 2", 1000, "IA")],
}

export default function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return { state, dispatch }
}
