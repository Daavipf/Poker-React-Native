import { gameState } from "@/types/gameState"
import PlayerActions from "./playerActions"
import RoundManager from "./roundManager"

interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK"; amount?: number }
}

export function gameReducer(state: gameState, action: action) {
  switch (action.type) {
    case "INICIAR_RODADA":
      return RoundManager.startRound(state)
    case "ACAO_JOGADOR":
      let novoState: gameState
      const { move, amount } = action.payload!
      if (move == "FOLD") {
        novoState = PlayerActions.playerFold(state)
      } else if (move == "CALL") {
        novoState = PlayerActions.playerCall(state)
      } else if (move == "RAISE") {
        novoState = PlayerActions.playerRaise(state, amount!)
      } else if (move === "CHECK") {
        novoState = PlayerActions.playerCheck(state)
      } else {
        novoState = state
      }

      if (novoState.indiceJogadorAtivo === novoState.indiceUltimoRaise) {
        return RoundManager.nextPhase(novoState)
      }

      return novoState
    case "AVANCAR_FASE":
      return RoundManager.nextPhase(state)

    default:
      return state
  }
}
