import { action } from "./gameReducer"

export const actions: Record<string, action> = {
  foldAction: { type: "ACAO_JOGADOR", payload: { move: "FOLD" } },
  callAction: { type: "ACAO_JOGADOR", payload: { move: "CALL" } },
  raiseAction: { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 50 } },
  checkAction: { type: "ACAO_JOGADOR", payload: { move: "CHECK" } },
}
