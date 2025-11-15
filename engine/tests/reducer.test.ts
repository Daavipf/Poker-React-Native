import { gameState } from "@/types/gameState"
import Deck from "../Deck"
import Player from "../Player"
import Table from "../Table"
import { action, gameReducer } from "../gameReducer"

const initialState: gameState = {
  deck: new Deck(),
  players: [
    new Player("Jogador 1", 100, "JOGADOR"),
    new Player("Jogador 2", 100, "IA"),
    new Player("Jogador 3", 100, "IA"),
  ],
  phase: "PREFLOP",
  table: new Table(),
  message: "",
}

const foldAction: action = { type: "ACAO_JOGADOR", payload: { move: "FOLD" } }
const callAction: action = { type: "ACAO_JOGADOR", payload: { move: "CALL" } }
const raiseAction: action = { type: "ACAO_JOGADOR", payload: { move: "RAISE" } }
const checkAction: action = { type: "ACAO_JOGADOR", payload: { move: "CHECK" } }
const NUM_PLAYER_CARDS = 2

describe("gameReducer", () => {
  it("should start the round correctly", () => {
    const newState = gameReducer(initialState, { type: "INICIAR_RODADA" })

    expect(newState.phase).toBe("PREFLOP")
    expect(newState.table.pot).toBe(75)

    expect(newState.players[0].hand.length).toBe(NUM_PLAYER_CARDS)
    expect(newState.players[1].hand.length).toBe(NUM_PLAYER_CARDS)
    expect(newState.players[2].hand.length).toBe(NUM_PLAYER_CARDS)

    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.table.iDealer).toBe(0)

    let iBigBlind = (newState.table.iDealer + 2) % newState.players.length
    expect(newState.players[iBigBlind].currentBet).toBe(50)

    let iSmallBlind = (newState.table.iDealer + 1) % newState.players.length
    expect(newState.players[iSmallBlind].currentBet).toBe(25)

    expect(newState.table.iLastRaiser).toBe(iBigBlind)
    expect(newState.table.communityCards.length).toBe(0)
    expect(newState.table.currentBet).toBe(50)
  })

  it("should process FOLD correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, foldAction)

    expect(newState.players[0].isFold).toBe(true)
    expect(newState.players[0].hand.length).toBe(0)
    expect(newState.table.iCurrentPlayer).toBe(1)
  })

  it("should process CALL correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)

    expect(newState.players[0].currentBet).toBe(50)
  })

  it("should process RAISE correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    expect(newState.table.pot).toBe(75)
    expect(newState.table.currentBet).toBe(50)
    expect(newState.players[0].currentBet).toBe(0)
    newState = gameReducer(newState, raiseAction)

    expect(newState.players[0].currentBet).toBe(100)
    expect(newState.table.pot).toBe(175)
    expect(newState.table.currentBet).toBe(100)
    expect(newState.table.iLastRaiser).toBe(0)
    expect(newState.table.iCurrentPlayer).toBe(1)
  })

  it("should process CHECK correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, checkAction)
    expect(newState.players[2].currentBet).toBe(50)
    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.table.currentBet).toBe(50)
    expect(newState.table.iLastRaiser).toBe(2)
    expect(newState.table.pot).toBe(150)
  })

  it("should validate CHECK correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    expect(newState.message).toBe("")
    newState = gameReducer(newState, checkAction)
    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.message).toBe("CHECK inválido: Aposta não coberta.")
  })

  it("should turn phase correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, checkAction)

    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.phase).toBe("FLOP")
  })

  it("should reach FLOP phase correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, checkAction)

    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.phase).toBe("FLOP")
    expect(newState.table.communityCards.length).toBe(3)
  })

  it("should reach TURN phase correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    for (let i = 0; i < 4; i++) {
      newState = gameReducer(newState, checkAction)
    }

    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.phase).toBe("TURN")
    expect(newState.table.communityCards.length).toBe(4)
  })

  it("should reach RIVER phase correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    for (let i = 0; i < 7; i++) {
      newState = gameReducer(newState, checkAction)
    }

    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.phase).toBe("RIVER")
    expect(newState.table.communityCards.length).toBe(5)
  })

  // it("should reach SHOWDOWN phase correctly", () => {
  //   let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
  //   newState = gameReducer(newState, callAction)
  //   newState = gameReducer(newState, callAction)
  //   for (let i = 0; i < 10; i++) {
  //     newState = gameReducer(newState, checkAction)
  //   }

  //   expect(newState.table.iCurrentPlayer).toBe(0)
  //   expect(newState.phase).toBe("SHOWDOWN")
  //   expect(newState.table.communityCards.length).toBe(5)
  // })

  it("should process this run correctly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction) // Jogador
    newState = gameReducer(newState, foldAction) // IA 1

    expect(newState.table.iCurrentPlayer).toBe(2)
    expect(newState.phase).toBe("PREFLOP")

    newState = gameReducer(newState, checkAction) // IA 2

    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.phase).toBe("FLOP")
  })

  it("sould get the winner correctly", () => {
    const players: Player[] = [
      new Player("Jogador 1", 100, "JOGADOR"),
      new Player("Jogador 2", 100, "IA"),
      new Player("Jogador 3", 100, "IA"),
    ]

    const hands = [
      [
        { id: "10C", valor: "10", naipe: "C", peso: 10 },
        { id: "JC", valor: "J", naipe: "C", peso: 11 },
      ],
      [
        { id: "3O", valor: "3", naipe: "O", peso: 3 },
        { id: "KC", valor: "K", naipe: "C", peso: 13 },
      ],
      [
        { id: "9C", valor: "9", naipe: "C", peso: 9 },
        { id: "8C", valor: "8", naipe: "C", peso: 8 },
      ],
    ]

    for (let i = 0; i < 3; i++) {
      players[i].setHand(hands[i])
    }

    const communityCards = [
      { id: "10O", valor: "10", naipe: "O", peso: 10 },
      { id: "10E", valor: "10", naipe: "E", peso: 10 },
      { id: "JP", valor: "J", naipe: "P", peso: 11 },
      { id: "3C", valor: "3", naipe: "C", peso: 3 },
      { id: "4O", valor: "4", naipe: "O", peso: 4 },
    ]

    const table = new Table()
    table.addCards(communityCards)
    table.incrementPot(500)

    const state: gameState = {
      deck: new Deck(),
      players,
      phase: "RIVER",
      table,
      message: "",
    }

    let newState: gameState = gameReducer(state, checkAction)
    newState = gameReducer(newState, checkAction)

    // OBS: nova rodada iniciada
    expect(newState.phase).toBe("PREFLOP")
    expect(newState.table.pot).toBe(75)
    expect(newState.players[0].chips).toBe(550)
  })

  it("should get the last survivor corretly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, foldAction) // Jogador
    newState = gameReducer(newState, foldAction) // IA 1

    expect(newState.table.iCurrentPlayer).toBe(1)
    expect(newState.phase).toBe("PREFLOP")
    expect(newState.players[2].chips).toBe(100)
  })

  it("should restart the game corretly", () => {
    let newState: gameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    for (let i = 0; i < 10; i++) {
      newState = gameReducer(newState, checkAction)
    }

    expect(newState.phase).toBe("PREFLOP")
    expect(newState.table.pot).toBe(75)
  })
})
