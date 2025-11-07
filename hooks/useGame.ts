import { baralhoInicial } from "@/game/cards"
import { gameReducer } from "@/game/gameReducer"
import { gameState } from "@/types/gameState"
import { useReducer } from "react"

const initialState: gameState = {
  baralho: baralhoInicial,
  deckIndex: 0,
  cartasComunitarias: [],
  pot: 0,
  fase: "PREFLOP",
  indiceJogadorAtivo: 0,
  indiceDealer: 0,
  apostaAtual: 0,
  ultimoRaise: -1,
  jogadores: [
    { id: "p1", nome: "Jogador", apostaAtual: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
    { id: "ia1", nome: "IA 1", apostaAtual: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
    { id: "ia2", nome: "IA 2", apostaAtual: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
  ],
}

export default function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return { state, dispatch }
}
