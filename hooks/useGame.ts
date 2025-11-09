import { baralhoInicial } from "@/engine/cards"
import { gameReducer } from "@/engine/gameReducer"
import { gameState } from "@/types/gameState"
import { useReducer } from "react"

const initialState: gameState = {
  baralho: baralhoInicial,
  deckIndex: 0,
  cartasComunitarias: [],
  pot: 0,
  fase: "PREFLOP",
  indiceJogadorAtivo: 0,
  indiceDealer: -1,
  apostaAtual: 0,
  indiceUltimoRaise: -1,
  jogadores: [
    { id: "p1", type: "JOGADOR", nome: "Jogador", apostaNaRodada: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
    { id: "ia1", type: "IA", nome: "IA 1", apostaNaRodada: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
    { id: "ia2", type: "IA", nome: "IA 2", apostaNaRodada: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
  ],
}

export default function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return { state, dispatch }
}
