import { gamePhase, gameState } from "@/types/gameState"

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
    const newTable = state.table.clone()
    let newPlayers = state.players.map((player) => player.clone())
    let newMessage = state.message
    let cards

    switch (state.phase) {
      case "PREFLOP":
        newPlayers = newTable.setPlayersHands(newPlayers, newDeck)
        newPlayers = newTable.setDealerAndBlinds(newPlayers)
        break
      case "FLOP":
        cards = [newDeck.drawCard(), newDeck.drawCard(), newDeck.drawCard()]
        newTable.addCards(cards)
        break
      case "TURN":
        cards = [newDeck.drawCard()]
        newTable.addCards(cards)
        break
      case "RIVER":
        cards = [newDeck.drawCard()]
        newTable.addCards(cards)
        break
      case "SHOWDOWN":
        break
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
}
