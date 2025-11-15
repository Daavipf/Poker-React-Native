import { gameState } from "@/types/gameState"
import RoundManager from "./RoundManager"

export interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK"; amount?: number }
}

export function gameReducer(state: gameState, action: action): gameState {
  const newDeck = state.deck.clone()
  const newTable = state.table.clone()
  let newPlayers = state.players.map((player) => player.clone())
  let newMessage = state.message

  switch (action.type) {
    case "INICIAR_RODADA":
      return RoundManager.setUpNewPhase(state)
    case "ACAO_JOGADOR":
      const { move, amount } = action.payload!
      const iCurrentPlayer = newTable.iCurrentPlayer
      const currentPlayer = newPlayers[iCurrentPlayer]

      if (move === "FOLD") {
        currentPlayer.fold()
        newTable.setNextPlayer(newPlayers)

        let players = newPlayers.filter((p) => !p.isFold)
        if (players.length === 1) {
          let iLastSurvivor = newPlayers.findIndex((p) => !p.isFold)
          newPlayers[iLastSurvivor].chips += newTable.pot
          newTable.pot = 0
          return RoundManager.restartGame({ ...state, players: newPlayers })
        }
      } else if (move === "CALL") {
        const bet = currentPlayer.call(newTable.currentBet)
        newTable.incrementPot(bet)
        newTable.setNextPlayer(newPlayers)
      } else if (move === "RAISE") {
        const bet = currentPlayer.raise(newTable.currentBet)
        newTable.incrementPot(bet)
        newTable.iLastRaiser = iCurrentPlayer
        newTable.currentBet = bet
        newTable.setNextPlayer(newPlayers)
      } else if (move === "CHECK") {
        if (currentPlayer.currentBet < newTable.currentBet) {
          newMessage = "CHECK inválido: Aposta não coberta."
          return { ...state, message: newMessage }
        }
        newTable.setNextPlayer(newPlayers)
      } else {
        newMessage = "Ação não reconhecida"
        return { ...state, message: newMessage }
      }

      let lastRaiserPlayer = newPlayers[newTable.iLastRaiser]
      let newPhase = state.phase
      let newState = {
        ...state,
        deck: newDeck,
        table: newTable,
        players: newPlayers,
        message: newMessage,
        phase: newPhase,
      }

      if (lastRaiserPlayer.name === currentPlayer.name) {
        newPhase = RoundManager.advancePhase(state.phase)
        newState = RoundManager.setUpNewPhase({ ...newState, phase: newPhase })
      }

      return newState
    case "AVANCAR_FASE":
      return state
    default:
      return state
  }
}
