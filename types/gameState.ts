import { card } from "./card"
import { player } from "./player"

export interface gameState {
  baralho: card[]
  deckIndex: number
  jogadores: player[]
  cartasComunitarias: card[]
  pot: number
  fase: "PREFLOP" | "FLOP" | "TURN" | "RIVER" | "SHOWDOWN"
  indiceJogadorAtivo: number
  indiceDealer: number
  apostaAtual: number
  indiceUltimoRaise: number
}

export type gamePhase = "PREFLOP" | "FLOP" | "TURN" | "RIVER" | "SHOWDOWN"
