import AI from "@/engine/AI/AI"
import Deck from "@/engine/Deck"
import { gameReducer } from "@/engine/gameReducer"
import Player from "@/engine/Player"
import Table from "@/engine/Table"
import { gameState } from "@/types/gameState"
import { useEffect, useReducer } from "react"

const initialState: gameState = {
  deck: new Deck(),
  table: new Table(),
  phase: "PREFLOP",
  message: "Pré-jogo",
  players: [
    new Player("Jogador", 1000, "JOGADOR", 0),
    new Player("IA 1", 1000, "IA", 1, "MATHEMATICIAN"),
    new Player("IA 2", 1000, "IA", 2, "ROCK"),
    new Player("IA 2", 1000, "IA", 3, "MANIAC"),
  ],
}

export default function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    const jogador = state.players[state.table.iCurrentPlayer]

    if (jogador.type === "IA") {
      setTimeout(
        () => {
          const action = AI.decideAction(state)
          dispatch(action)
        },
        Math.max(3000, Math.random() * 5000),
      )
    }
  }, [state])

  return { state, dispatch }
}
