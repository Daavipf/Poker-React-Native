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

describe("Real Game Simulations", () => {
  let state: gameState

  beforeEach(() => {
    state = gameReducer(defaultState, { type: "INICIAR_RODADA" })
  })

  it("Scenario: The Walk (Everyone folds to Big Blind)", () => {
    // Ordem: UTG (P3) -> Dealer (P0) -> SB (P1) -> BB (P2)

    // P3 Folds
    state = gameReducer(state, foldAction)
    expect(state.table.iCurrentPlayer).toBe(0)

    // P0 Folds
    state = gameReducer(state, foldAction)
    expect(state.table.iCurrentPlayer).toBe(1)

    // P1 (Small Blind) Folds
    state = gameReducer(state, foldAction)

    // O jogo deve detectar vitória automática do BB e reiniciar
    // Dependendo da implementação, pode ir para "PREFLOP" direto (novo jogo) ou "SHOWDOWN"
    // Baseado nos testes anteriores, ele reinicia para PREFLOP
    expect(state.phase).toBe("PREFLOP")

    // O Dealer deve ter mudado
    expect(state.table.iDealer).toBe(1)

    // O jogador 2 (Antigo BB) deve ter ganho as fichas do SB (25) + as suas de volta
    // Stack inicial 1000. Pagou 50 (950). Ganhou 75. Final: 1025.
    expect(state.players[2].chips).toBe(1000)
    expect(state.players[2].role).toBe("SMALL_BLIND")
  })

  it("Scenario: Pre-flop Aggression (Raise and Calls)", () => {
    // P3 (UTG) aumenta para 100
    state = gameReducer(state, raiseAction) // Aumenta 50 sobre o BB (50) = 100 total
    expect(state.table.currentBet).toBe(100)
    expect(state.table.pot).toBe(175) // 25(SB) + 50(BB) + 100(UTG)
    expect(state.table.iLastRaiser).toBe(3)

    // P0 (Dealer) paga 100
    state = gameReducer(state, callAction)
    expect(state.table.pot).toBe(275) // +100

    // P1 (SB) folda
    state = gameReducer(state, foldAction)
    expect(state.players[1].isFold).toBe(true)

    // P2 (BB) paga a diferença (já pôs 50, põe mais 50)
    state = gameReducer(state, callAction)

    // Agora todos agiram e igualaram a aposta. Deve ir para FLOP.
    expect(state.phase).toBe("FLOP")
    expect(state.table.pot).toBe(325) // 275 + 50
    expect(state.table.communityCards.length).toBe(3)
  })

  it("Scenario: Flop Betting (Check, Bet, Call)", () => {
    // Setup: Chegar ao FLOP com todos pagando (Limp pot)
    state = gameReducer(state, callAction) // P3 call
    state = gameReducer(state, callAction) // P0 call
    state = gameReducer(state, callAction) // P1 call
    state = gameReducer(state, checkAction) // P2 check (BB option)

    expect(state.phase).toBe("FLOP")

    // Ordem pós-flop começa pelo SB (P1)
    expect(state.table.iCurrentPlayer).toBe(1)

    // P1 Checks
    state = gameReducer(state, checkAction)

    // P2 Checks
    state = gameReducer(state, checkAction)

    // P3 Aposta (Raise/Bet)
    state = gameReducer(state, raiseAction)
    // Assumindo raiseAction amount=50. Pot era 200. Agora 250.
    expect(state.table.currentBet).toBe(50)
    expect(state.table.iLastRaiser).toBe(3)

    // P0 Folds
    state = gameReducer(state, foldAction)

    // P1 (que deu check antes) agora tem que Pagar ou Foldar. Paga.
    state = gameReducer(state, callAction)

    // P2 Folds
    state = gameReducer(state, foldAction)

    // A rodada de apostas acabou? P3 apostou, P1 pagou.
    // Se P3 foi o agressor e P1 fechou a ação, deve ir para TURN.
    expect(state.phase).toBe("TURN")
    expect(state.table.communityCards.length).toBe(4)
  })
})
