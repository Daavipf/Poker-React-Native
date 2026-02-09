import { gameState } from "@/types/gameState"
import Deck from "../Deck"
import Player from "../Player"
import Table from "../Table"
import { action, gameReducer } from "../gameReducer"

let defaultState: gameState = {
  deck: new Deck(),
  players: [
    new Player("Jogador 1", 1000, "JOGADOR", 0),
    new Player("Jogador 2", 1000, "IA", 1, "MATHEMATICIAN"),
    new Player("Jogador 3", 1000, "IA", 2, "MANIAC"),
    new Player("Jogador 4", 1000, "IA", 3, "CALLING_STATION"),
  ],
  phase: "PREFLOP",
  table: new Table(),
  message: "",
}

const foldAction: action = { type: "ACAO_JOGADOR", payload: { move: "FOLD" } }
const callAction: action = { type: "ACAO_JOGADOR", payload: { move: "CALL" } }
const raiseAction: action = { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 50 } }
const checkAction: action = { type: "ACAO_JOGADOR", payload: { move: "CHECK" } }

describe("Winner & Pot distribution", () => {
  it("Should define winner correctly", () => {
    defaultState.table.pot = 2000
    defaultState.table.communityCards = [
      { id: "3O", naipe: "O", peso: 3, valor: "3" },
      { id: "4O", naipe: "O", peso: 4, valor: "4" },
      { id: "5O", naipe: "O", peso: 5, valor: "5" },
      { id: "3C", naipe: "C", peso: 3, valor: "3" },
      { id: "7E", naipe: "E", peso: 7, valor: "7" },
    ]

    defaultState.players[0].hand = [
      { id: "6O", naipe: "O", peso: 6, valor: "6" },
      { id: "7O", naipe: "O", peso: 7, valor: "7" },
    ]

    defaultState.players[1].hand = [
      { id: "6C", naipe: "C", peso: 6, valor: "6" },
      { id: "KO", naipe: "O", peso: 13, valor: "K" },
    ]

    defaultState.players[2].hand = [
      { id: "6E", naipe: "E", peso: 6, valor: "6" },
      { id: "JO", naipe: "O", peso: 11, valor: "J" },
    ]

    defaultState.players[3].hand = [
      { id: "AE", naipe: "E", peso: 14, valor: "A" },
      { id: "JP", naipe: "P", peso: 11, valor: "J" },
    ]

    defaultState.phase = "RIVER"

    for (let i = 0; i < defaultState.players.length; i++) {
      defaultState = gameReducer(defaultState, callAction)
    }

    expect(defaultState.phase).toBe("PREFLOP")
    expect(defaultState.players[0].chips).toBeGreaterThan(1000)
  })
})
