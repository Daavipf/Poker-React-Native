import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import RoundManager from "./RoundManager"

export interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK" | "ALL_IN"; amount?: number }
}

export function gameReducer(state: gameState, action: action): gameState {
  let newState = { ...state }

  switch (action.type) {
    case "INICIAR_RODADA":
      newState = RoundManager.setUpNewPhase(newState)
      break
    case "ACAO_JOGADOR":
      newState = processPlayerAction(action, newState)
      break
    case "AVANCAR_FASE":
      newState = RoundManager.setUpNewPhase(newState)
      break
    default:
      break
  }

  if (RoundManager.everyPlayerMoved(newState.players)) {
    newState.phase = RoundManager.advancePhase(newState.phase)
    newState = RoundManager.setUpNewPhase(newState)
  }

  return newState
}

function processPlayerAction(action: action, newState: gameState) {
  const { amount, move } = action.payload!

  switch (move) {
    case "FOLD":
      newState.players[newState.table.iCurrentPlayer].fold()
      newState.message = `${newState.players[newState.table.iCurrentPlayer].name} saiu.`

      const iWinner = getWinnerByFolds(newState.players)
      if (iWinner !== -1) {
        newState.table.distributePot(newState.players, iWinner)
        newState = RoundManager.restartGame(newState)

        return newState
      }

      newState.table.rotateToNextPlayer(newState.players)

      break
    case "CALL":
      let bet = newState.players[newState.table.iCurrentPlayer].call(newState.table.currentBet)
      newState.table.incrementPot(bet)

      newState.message = `${newState.players[newState.table.iCurrentPlayer].name} pagou a aposta.`

      newState.table.rotateToNextPlayer(newState.players)

      break
    case "CHECK":
      try {
        newState.players[newState.table.iCurrentPlayer].check(newState.table.currentBet)

        newState.table.rotateToNextPlayer(newState.players)
      } catch (error: any) {
        newState.message = error.message

        return newState
      }

      break
    case "RAISE":
      let raiseBet = newState.players[newState.table.iCurrentPlayer].raise(newState.table.currentBet, amount!)
      newState.table.incrementPot(raiseBet)

      if (newState.players[newState.table.iCurrentPlayer].isAllIn) {
        newState.table.currentBet = raiseBet
      } else {
        newState.table.incrementCurrentBet(amount!)
      }

      newState.message = `${newState.players[newState.table.iCurrentPlayer].name} aumentou a aposta.`

      newState.players = RoundManager.restartPlayersMove(newState.players)
      newState.players[newState.table.iCurrentPlayer].hasMoved = true

      newState.table.setNextRaiser(newState.table.iCurrentPlayer)
      newState.table.rotateToNextPlayer(newState.players)

      break
    case "ALL_IN":
      let allInBet = newState.players[newState.table.iCurrentPlayer].allIn()
      newState.table.incrementPot(allInBet)
      newState.table.incrementCurrentBet(allInBet)

      newState.message = `${newState.players[newState.table.iCurrentPlayer].name} deu ALL-IN!`

      newState.players = RoundManager.restartPlayersMove(newState.players)
      newState.players[newState.table.iCurrentPlayer].hasMoved = true

      newState.table.setNextRaiser(newState.table.iCurrentPlayer)
      newState.table.rotateToNextPlayer(newState.players)

      break
    default:
      break
  }

  return newState
}

function getWinnerByFolds(players: player[]): number {
  const activePLayersIndexes: number[] = []

  for (let i = 0; i < players.length; i++) {
    if (!players[i].isFold) {
      activePLayersIndexes.push(i)
    }
  }

  if (activePLayersIndexes.length === 1) {
    return activePLayersIndexes[0]
  }

  return -1
}
