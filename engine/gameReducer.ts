import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import RoundManager from "./RoundManager"

export interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK" | "ALL_IN"; amount?: number }
}

export function gameReducer(state: gameState, action: action): gameState {
  let newState = { ...state }

  //state.players = state.players.map((p) => (p.chips <= 0 ? { ...p, isBusted: true } : p))

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

function processPlayerAction(action: action, newState: gameState): gameState {
  const { amount, move } = action.payload!
  let table = newState.table
  let iCurrentPlayer = table.iCurrentPlayer
  let currentPlayer = newState.players[iCurrentPlayer]

  switch (move) {
    case "FOLD":
      currentPlayer.fold()
      newState.message = `${currentPlayer.name} saiu.`

      const iWinner = getWinnerByFolds(newState.players)
      if (iWinner !== -1) {
        table.distributePot(newState.players, iWinner)
        newState = RoundManager.restartGame(newState)

        return newState
      }

      table.rotateToNextPlayer(newState.players)

      break
    case "CALL":
      let bet = currentPlayer.call(table.currentBet)
      table.incrementPot(bet)

      newState.message = `${currentPlayer.name} pagou a aposta.`

      table.rotateToNextPlayer(newState.players)

      break
    case "CHECK":
      try {
        currentPlayer.check(table.currentBet)

        newState.message = `${currentPlayer.name} passou.`

        table.rotateToNextPlayer(newState.players)
      } catch (error: any) {
        newState.message = error.message

        return newState
      }

      break
    case "RAISE":
      let raiseBet = currentPlayer.raise(table.currentBet, amount!)
      table.incrementPot(raiseBet)

      if (currentPlayer.isAllIn) {
        table.currentBet = raiseBet
      } else {
        table.incrementCurrentBet(amount!)
      }

      newState.message = `${currentPlayer.name} aumentou a aposta.`

      newState.players = RoundManager.restartPlayersMove(newState.players)
      currentPlayer.hasMoved = true

      table.setNextRaiser(iCurrentPlayer)
      table.rotateToNextPlayer(newState.players)

      break
    case "ALL_IN":
      let allInBet = currentPlayer.allIn()
      table.incrementPot(allInBet)
      table.incrementCurrentBet(allInBet)

      newState.message = `${currentPlayer.name} deu ALL-IN!`

      newState.players = RoundManager.restartPlayersMove(newState.players)
      currentPlayer.hasMoved = true

      table.setNextRaiser(iCurrentPlayer)
      table.rotateToNextPlayer(newState.players)

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
