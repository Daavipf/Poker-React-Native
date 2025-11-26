import { gamePhase, gameState } from "@/types/gameState"
import { player } from "@/types/player"

export default class RoundManager {
  static advancePhase(currentPhase: gamePhase): gamePhase {
    switch (currentPhase) {
      case "PREFLOP":
        return "FLOP"
      case "FLOP":
        return "TURN"
      case "TURN":
        return "RIVER"
      case "RIVER":
        return "SHOWDOWN"
      case "SHOWDOWN":
        return "PREFLOP"
      default:
        return "PREFLOP"
    }
  }

  static setUpNewPhase(state: gameState): gameState {
    const newDeck = state.deck.clone()
    let newTable = state.table.clone()
    let newPlayers = state.players.map((player) => player.clone())
    let newMessage = state.message
    let cards

    newPlayers = this.restartPlayersMove(newPlayers)

    switch (state.phase) {
      case "PREFLOP":
        newPlayers = newTable.setPlayersHands(newPlayers, newDeck)
        newPlayers = newTable.setDealerAndBlinds(newPlayers)
        break
      case "FLOP":
        newTable.setNextActivePlayerAfterDealer(newPlayers)
        cards = [newDeck.drawCard(), newDeck.drawCard(), newDeck.drawCard()]
        newTable.addCards(cards)
        newTable.resetCurrentBet()
        break
      case "TURN":
        newTable.setNextActivePlayerAfterDealer(newPlayers)
        cards = [newDeck.drawCard()]
        newTable.addCards(cards)
        newTable.resetCurrentBet()
        break
      case "RIVER":
        newTable.setNextActivePlayerAfterDealer(newPlayers)
        cards = [newDeck.drawCard()]
        newTable.addCards(cards)
        newTable.resetCurrentBet()
        break
      case "SHOWDOWN":
        let iWinner = newTable.evaluateWinner(newPlayers)

        newTable.distributePot(newPlayers, iWinner)

        return RoundManager.restartGame({
          ...state,
          deck: newDeck,
          table: newTable,
          players: newPlayers,
          message: newMessage,
        })

      default:
        break
    }

    return {
      ...state,
      deck: newDeck,
      table: newTable,
      players: newPlayers,
      message: newMessage,
    }
  }

  static restartGame(state: gameState): gameState {
    const newDeck = state.deck.clone()
    const newTable = state.table.clone()
    let newPlayers = state.players.map((player) => player.clone())
    let newMessage = state.message

    newTable.pot = 0
    newTable.communityCards = []
    newTable.setNextDealer(newPlayers)

    let resetPlayers = newPlayers.map((p) => {
      p.currentBet = 0
      p.isAllIn = false
      p.isFold = false
      p.hasMoved = false

      return p
    })

    resetPlayers = newTable.setPlayersHands(resetPlayers, newDeck)
    resetPlayers = newTable.setDealerAndBlinds(resetPlayers)

    return {
      ...state,
      players: resetPlayers,
      deck: newDeck,
      table: newTable,
      message: newMessage,
      phase: "PREFLOP",
    }
  }

  static restartPlayersMove(players: player[]): player[] {
    const newPlayers = players.map((p, index) => {
      p.hasMoved = false

      return p
    })

    return newPlayers
  }

  static everyPlayerMoved(players: player[]): boolean {
    let activePlayers = players.filter((p) => !p.isFold)
    return activePlayers.every((p) => p.hasMoved)
  }
}
