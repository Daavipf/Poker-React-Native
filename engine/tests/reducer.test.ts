import { gameState } from "@/types/gameState"
import Deck from "../Deck"
import Player from "../Player"
import Table from "../Table"
import { action, gameReducer } from "../gameReducer"

const defaultState: gameState = {
  deck: new Deck(),
  players: [
    new Player("Jogador 1", 1000, "JOGADOR"),
    new Player("Jogador 2", 1000, "IA"),
    new Player("Jogador 3", 1000, "IA"),
    new Player("Jogador 4", 1000, "IA"),
  ],
  phase: "PREFLOP",
  table: new Table(),
  message: "",
}

const foldAction: action = { type: "ACAO_JOGADOR", payload: { move: "FOLD" } }
const callAction: action = { type: "ACAO_JOGADOR", payload: { move: "CALL" } }
const raiseAction: action = { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 50 } }
const checkAction: action = { type: "ACAO_JOGADOR", payload: { move: "CHECK" } }
const NUM_PLAYER_CARDS = 2

describe("Initialization Tests", () => {
  const state = gameReducer(defaultState, { type: "INICIAR_RODADA" })

  it("Phase", () => {
    expect(state.phase).toBe("PREFLOP")
  })

  it("Pot", () => {
    expect(state.table.pot).toBe(75)
  })

  it("Players hands", () => {
    for (let i = 0; i < state.players.length; i++) {
      expect(state.players[i].hand.length).toBe(NUM_PLAYER_CARDS)
    }
  })

  it("Players move flag", () => {
    for (let i = 0; i < state.players.length; i++) {
      expect(state.players[i].hasMoved).toBe(false)
    }
  })

  it("Dealer index", () => {
    let iDealer = state.table.iDealer
    expect(iDealer).toBe(0)
    expect(state.players[iDealer].role).toBe("DEALER")
  })

  it("Raiser index", () => {
    expect(state.table.iLastRaiser).toBe(2)
  })

  it("Current player index", () => {
    expect(state.table.iCurrentPlayer).toBe(3)
  })

  it("Current player index with 3 players", () => {
    const defaultState: gameState = {
      deck: new Deck(),
      players: [
        new Player("Jogador 1", 1000, "JOGADOR"),
        new Player("Jogador 2", 1000, "IA"),
        new Player("Jogador 3", 1000, "IA"),
      ],
      phase: "PREFLOP",
      table: new Table(),
      message: "",
    }

    const state = gameReducer(defaultState, { type: "INICIAR_RODADA" })
    expect(state.table.iCurrentPlayer).toBe(0)
  })

  it("Current player index with 2 players", () => {
    const defaultState: gameState = {
      deck: new Deck(),
      players: [new Player("Jogador 1", 1000, "JOGADOR"), new Player("Jogador 2", 1000, "IA")],
      phase: "PREFLOP",
      table: new Table(),
      message: "",
    }
    const state = gameReducer(defaultState, { type: "INICIAR_RODADA" })

    expect(state.table.iCurrentPlayer).toBe(1)
  })

  it("Big blind", () => {
    let iBigBlind = (state.table.iDealer + 2) % state.players.length
    expect(iBigBlind).toBe(2)
    expect(state.players[iBigBlind].currentBet).toBe(50)
    expect(state.players[iBigBlind].chips).toBe(950)
    expect(state.players[iBigBlind].role).toBe("BIG_BLIND")
  })

  it("Small blind", () => {
    let iSmallBlind = (state.table.iDealer + 1) % state.players.length
    expect(iSmallBlind).toBe(1)
    expect(state.players[iSmallBlind].currentBet).toBe(25)
    expect(state.players[iSmallBlind].chips).toBe(975)
    expect(state.players[iSmallBlind].role).toBe("SMALL_BLIND")
  })

  // TODO: Blind tests with different numbers of players

  it("Table current bet", () => {
    expect(state.table.currentBet).toBe(50)
  })

  it("Community Cards", () => {
    expect(state.table.communityCards.length).toBe(0)
  })
})

describe("Player actions", () => {
  let state: gameState

  beforeEach(() => {
    state = gameReducer(defaultState, { type: "INICIAR_RODADA" })
  })

  it("CALL", () => {
    state = gameReducer(state, callAction)
    expect(state.table.pot).toBe(125)
  })

  it("FOLD", () => {
    state = gameReducer(state, foldAction)
    expect(state.table.pot).toBe(75)
    expect(state.players[3].isFold).toBe(true)
  })

  it("RAISE", () => {
    state = gameReducer(state, raiseAction)
    expect(state.table.pot).toBe(175)
    expect(state.table.currentBet).toBe(100)
    expect(state.table.iLastRaiser).toBe(3)
  })

  it("CHECK", () => {
    state = gameReducer(state, callAction) //IA 3
    state = gameReducer(state, callAction) //Jogador
    state = gameReducer(state, callAction) //IA 1
    state = gameReducer(state, checkAction) //IA 2 (Big Blind)
    expect(state.table.pot).toBe(200)
  })

  it("Invalid CHECK", () => {
    state = gameReducer(state, checkAction)
    expect(state.table.pot).toBe(75)
    expect(state.message).toBe("CHECK inválido: Aposta não coberta.")
  })

  //TODO: All-in tests
})

describe("Game Flow", () => {
  let state: gameState

  beforeEach(() => {
    state = gameReducer(defaultState, { type: "INICIAR_RODADA" })
  })

  it("Set Next Player", () => {
    expect(state.table.iCurrentPlayer).toBe(3)
    state = gameReducer(state, callAction)
    expect(state.table.iCurrentPlayer).toBe(0)
  })

  it("Reach FLOP", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 4; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.phase).toBe("FLOP")
  })

  it("Correct FLOP cards amount", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 4; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.table.communityCards.length).toBe(3)
    for (let j = 0; j < state.players.length; j++) {
      expect(state.players[j].hand.length).toBe(2)
    }
  })

  it("Reach TURN", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 8; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.phase).toBe("TURN")
  })

  it("Correct TURN cards amount", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 8; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.table.communityCards.length).toBe(4)
    for (let j = 0; j < state.players.length; j++) {
      expect(state.players[j].hand.length).toBe(2)
    }
  })

  it("Reach RIVER", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 12; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.phase).toBe("RIVER")
  })

  it("Correct RIVER cards amount", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 12; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.table.communityCards.length).toBe(5)
    for (let j = 0; j < state.players.length; j++) {
      expect(state.players[j].hand.length).toBe(2)
    }
  })

  it("Restart Game", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 16; i++) {
      state = gameReducer(state, callAction)
    }

    //Aqui a fase de showdown já foi processada e o pot distribuído automaticamente
    expect(state.phase).toBe("PREFLOP")
  })

  it("New round blind rules correctly", () => {
    expect(state.phase).toBe("PREFLOP")
    for (let i = 0; i < 16; i++) {
      state = gameReducer(state, callAction)
    }

    expect(state.table.iCurrentPlayer).toBe(0)
    expect(state.players[0].role).toBe(undefined)
    expect(state.table.iDealer).toBe(1)
    expect(state.players[1].role).toBe("DEALER")
    let iBigBlind = (state.table.iDealer + 2) % state.players.length
    expect(iBigBlind).toBe(3)
    expect(state.table.iLastRaiser).toBe(iBigBlind)
    expect(state.players[iBigBlind].role).toBe("BIG_BLIND")
    let iSmallBlind = (state.table.iDealer + 1) % state.players.length
    expect(iSmallBlind).toBe(2)
    expect(state.players[iSmallBlind].role).toBe("SMALL_BLIND")
  })
})
