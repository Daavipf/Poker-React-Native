import { deck } from "@/types/deck"
import { gamePhase } from "@/types/gameState"
import { iplayer } from "@/types/iplayer"
import { table } from "@/types/table"
import RoundManager from "./roundManager"

export interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK"; amount?: number }
}

export interface tempGameState {
  deck: deck
  players: iplayer[]
  phase: gamePhase
  table: table
  message: string
}

export function gameReducer(state: tempGameState, action: action): tempGameState {
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

/*export function gameReducer(state: gameState, action: action) {
  switch (action.type) {
    case "INICIAR_RODADA":
      return RoundManager.startRound(state)
    case "ACAO_JOGADOR":
      const { move, amount } = action.payload!
      const indiceQueAgiu = state.indiceJogadorAtivo
      let novoState: gameState

      if (move == "FOLD") {
        novoState = PlayerActions.playerFold(state)
      } else if (move == "CALL") {
        novoState = PlayerActions.playerCall(state)
      } else if (move == "RAISE") {
        novoState = PlayerActions.playerRaise(state, amount!)
        return novoState
      } else if (move === "CHECK") {
        novoState = PlayerActions.playerCheck(state)
      } else {
        return state
      }

      if (indiceQueAgiu === novoState.indiceUltimoRaise) {
        return RoundManager.nextPhase(novoState)
      }

      if (novoState.indiceJogadorAtivo === novoState.indiceUltimoRaise) {
        let ultimoJogadorDaRodada = novoState.jogadores[novoState.indiceJogadorAtivo]
        const jaAgiu = !!ultimoJogadorDaRodada.lastMove

        if (novoState.fase === "PREFLOP" && ultimoJogadorDaRodada.role === "Big Blind" && !jaAgiu) {
          return novoState
        }

        if (novoState.fase !== "PREFLOP" && novoState.apostaAtual === 0 && !jaAgiu) {
          return novoState // Permite ao primeiro jogador agir (check ou bet)
        }

        return RoundManager.nextPhase(novoState)
      }

      return novoState
    case "AVANCAR_FASE":
      return RoundManager.nextPhase(state)

    default:
      return state
  }
}
*/
