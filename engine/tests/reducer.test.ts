import Deck from "../Deck"
import Player from "../Player"
import Table from "../Table"
import { action, gameReducer, tempGameState } from "../gameReducer"

const initialState: tempGameState = {
  deck: new Deck(),
  players: [
    new Player("Jogador 1", 100, "JOGADOR"),
    new Player("Jogador 2", 100, "IA"),
    new Player("Jogador 3", 100, "IA"),
  ],
  phase: "PREFLOP",
  table: new Table(),
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
    let newState: tempGameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, foldAction)

    expect(newState.players[0].isFold).toBe(true)
    expect(newState.players[0].hand.length).toBe(0)
    expect(newState.table.iCurrentPlayer).toBe(1)
  })

  it("should process CALL correctly", () => {
    let newState: tempGameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)

    expect(newState.players[0].currentBet).toBe(50)
  })

  it("should process RAISE correctly", () => {
    let newState: tempGameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
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
    let newState: tempGameState = gameReducer(initialState, { type: "INICIAR_RODADA" })
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, callAction)
    newState = gameReducer(newState, checkAction)
    expect(newState.players[2].currentBet).toBe(50)
    expect(newState.table.iCurrentPlayer).toBe(0)
    expect(newState.table.currentBet).toBe(50)
    expect(newState.table.iLastRaiser).toBe(2)
    expect(newState.table.pot).toBe(150)
  })
})

/*
const initialState: gameState = {
  baralho: baralhoInicial,
  deckIndex: 0,
  cartasComunitarias: [],
  pot: 0,
  fase: "PREFLOP",
  indiceJogadorAtivo: 0,
  indiceDealer: -1,
  apostaAtual: 0,
  indiceUltimoRaise: -1,
  jogadores: [
    {
      id: "p1",
      type: "JOGADOR",
      nome: "Jogador",
      apostaNaRodada: 0,
      fichas: 1000,
      mao: [],
      saiu: false,
      allIn: false,
    },
    { id: "ia1", type: "IA", nome: "IA 1", apostaNaRodada: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
    { id: "ia2", type: "IA", nome: "IA 2", apostaNaRodada: 0, fichas: 1000, mao: [], saiu: false, allIn: false },
  ],
}

const startRoundAction: action = { type: "INICIAR_RODADA" }
const foldAction: action = { type: "ACAO_JOGADOR", payload: { move: "FOLD" } }
const callAction: action = { type: "ACAO_JOGADOR", payload: { move: "CALL" } }
const checkAction: action = { type: "ACAO_JOGADOR", payload: { move: "CHECK" } }
const raiseAction: action = { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 50 } }

describe("gameReducer", () => {
  it("should start the round correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)

    expect(newState.fase).toBe("PREFLOP")
    expect(newState.pot).toBe(75)
    expect(newState.apostaAtual).toBe(50)
    expect(newState.jogadores[0].mao.length).toBe(2)
    expect(newState.indiceJogadorAtivo).toBe(0)
    expect(newState.indiceDealer).toBe(0)
    expect(newState.indiceUltimoRaise).toBe(2)
  })

  it("should process FOLD correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)
    newState = gameReducer(newState, foldAction)

    expect(newState.fase).toBe("PREFLOP")
    expect(newState.jogadores[0].saiu).toBe(true)
  })

  it("should process CALL correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)
    newState = gameReducer(newState, callAction)

    expect(newState.fase).toBe("PREFLOP")
    expect(newState.jogadores[0].apostaNaRodada).toBe(50)
  })

  it("should process RAISE correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)
    newState = gameReducer(newState, raiseAction)

    expect(newState.fase).toBe("PREFLOP")
    expect(newState.apostaAtual).toBe(100)
    expect(newState.jogadores[0].apostaNaRodada).toBe(100)
    expect(newState.pot).toBe(175)
  })

  /*it("should wait for the last player to raise make the last move", () => {
    let newState = gameReducer(initialState, startRoundAction)
    newState = gameReducer(newState, callAction) // jogador
    newState = gameReducer(newState, foldAction) // IA 1

    expect(newState.fase).toBe("PREFLOP")
    expect(newState.indiceJogadorAtivo).toBe(2)
  })

  it("should reach FLOP phase correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)
    newState = gameReducer(newState, callAction) // jogador
    newState = gameReducer(newState, callAction) // IA 1
    newState = gameReducer(newState, callAction) // IA 2

    expect(newState.indiceJogadorAtivo).toBe(1)
    expect(newState.fase).toBe("FLOP")
  })

  it("should reach RIVER phase correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)
    expect(newState.fase).toBe("PREFLOP")

    newState = gameReducer(newState, callAction) // jogador
    newState = gameReducer(newState, callAction) // IA 1
    newState = gameReducer(newState, checkAction) // IA 2

    expect(newState.fase).toBe("FLOP")

    newState = gameReducer(newState, checkAction) // jogador
    newState = gameReducer(newState, checkAction) // IA 1
    newState = gameReducer(newState, checkAction) // IA 2

    expect(newState.fase).toBe("TURN")
  })

  /*it("should reach FLOP phase correctly", () => {
    let newState = gameReducer(initialState, startRoundAction)
    newState = gameReducer(newState, callAction) // jogador
    newState = gameReducer(newState, foldAction) // IA 1
    newState = gameReducer(newState, checkAction) // IA 2

    expect(newState.fase).toBe("FLOP")
    expect(newState.indiceJogadorAtivo).toBe(0)
  })
})*/
