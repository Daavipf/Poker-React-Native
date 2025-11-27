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

  it("Cenário: Big Blind Option (Limp Pot)", () => {
    // Todos pagam o Blind (Limp), chegando no BB que tem a opção de Check.

    // UTG (P3) Paga
    state = gameReducer(state, callAction)
    // Dealer (P0) Paga
    state = gameReducer(state, callAction)
    // SB (P1) Paga (Completa os 25 que faltavam)
    state = gameReducer(state, callAction)

    // A ação volta para o BB (P2). Como ninguém aumentou, ele pode dar Check.
    expect(state.table.iCurrentPlayer).toBe(2)
    expect(state.table.currentBet).toBe(50)

    // BB dá Check
    state = gameReducer(state, checkAction)

    // O pote deve ter 4 jogadores * 50 = 200
    expect(state.table.pot).toBe(200)
    // Fase deve mudar para FLOP
    expect(state.phase).toBe("FLOP")
  })

  it("Cenário: 3-Bet War (Raise e Re-Raise Pre-flop)", () => {
    // UTG (P3) Aumenta para 100 (Raise padrão)
    state = gameReducer(state, raiseAction)
    expect(state.players[3].currentBet).toBe(100)
    expect(state.table.currentBet).toBe(100)
    expect(state.table.iLastRaiser).toBe(3)

    // Dealer (P0) faz um Re-Raise (3-Bet) para 150
    // Nota: Dependendo da sua implementação, o payload amount pode ser o total ou o incremento.
    // Aqui assumimos incremento de 50 sobre a aposta anterior.
    state = gameReducer(state, raiseAction)
    expect(state.table.currentBet).toBe(150)
    expect(state.table.iLastRaiser).toBe(0)
    expect(state.players[0].currentBet).toBe(150)

    // SB (P1) Folds (Muito caro para ele)
    state = gameReducer(state, foldAction)

    // BB (P2) Folds
    state = gameReducer(state, foldAction)

    // A ação volta para o UTG (P3) que tinha apostado 100. Ele precisa pagar 50 para ver o flop.
    expect(state.table.iCurrentPlayer).toBe(3)

    // UTG Paga (Call)
    state = gameReducer(state, callAction)
    expect(state.players[3].currentBet).toBe(150)

    // Ambas as apostas igualadas em 150.
    // Pot: 25(SB morto) + 50(BB morto) + 150(UTG) + 150(Dealer) = 375
    expect(state.table.pot).toBe(375)
    expect(state.phase).toBe("FLOP")
  })

  it("Cenário: Folding no Turn (Reduzindo jogadores ativos)", () => {
    // Setup: 3 Jogadores vão ver o Flop (UTG folda pre-flop)
    state = gameReducer(state, foldAction) // UTG Fold
    state = gameReducer(state, callAction) // Dealer Call
    state = gameReducer(state, callAction) // SB Call
    state = gameReducer(state, checkAction) // BB Check

    expect(state.phase).toBe("FLOP")

    // Flop: Todos dão Check (Check-around)
    state = gameReducer(state, checkAction) // SB
    state = gameReducer(state, checkAction) // BB
    state = gameReducer(state, checkAction) // Dealer

    expect(state.phase).toBe("TURN")

    // Turn: SB Aposta, BB Paga, Dealer Desiste
    state = gameReducer(state, raiseAction) // SB Aposta 50
    state = gameReducer(state, callAction) // BB Paga 50
    state = gameReducer(state, foldAction) // Dealer Folds

    // A rodada deve acabar pois todos ativos (SB e BB) agiram e igualaram
    expect(state.phase).toBe("RIVER")

    // Apenas SB e BB devem estar ativos
    expect(state.players[0].isFold).toBe(true) // Dealer
    expect(state.players[3].isFold).toBe(true) // UTG
    expect(state.players[1].isFold).toBe(false) // SB
    expect(state.players[2].isFold).toBe(false) // BB
  })

  it("Cenário: Blind Defense (SB vs Dealer)", () => {
    expect(state.table.pot).toBe(75)
    expect(state.table.currentBet).toBe(50)
    // UTG Fold
    state = gameReducer(state, foldAction)

    // Dealer tenta roubar os blinds (Raise 50 -> Total 100)
    state = gameReducer(state, raiseAction)
    expect(state.table.pot).toBe(175)
    expect(state.table.currentBet).toBe(100)

    // SB defende agressivamente (Re-Raise +50 -> Total 150)
    state = gameReducer(state, raiseAction)
    expect(state.table.currentBet).toBe(150)
    expect(state.table.pot).toBe(350)

    // BB sai do caminho
    state = gameReducer(state, foldAction)

    // Dealer paga para ver
    state = gameReducer(state, callAction)

    expect(state.phase).toBe("FLOP")
    expect(state.table.pot).toBe(400) // 50(BB morto) + 175(SB) + 175(Dealer)

    // No Flop, o primeiro a agir deve ser o SB (P1), pois ele está à esquerda do Dealer
    expect(state.table.iCurrentPlayer).toBe(1)
  })

  it("Deve tratar All-in como um Raise gigante", () => {
    // 1. UTG (P3) tem 1000 fichas e decide ir All-in
    // Isso é tecnicamente um RAISE para 1000.
    const allInAmount = state.players[3].chips
    const allInAction: action = {
      type: "ACAO_JOGADOR",
      payload: { move: "RAISE", amount: allInAmount },
    }

    state = gameReducer(state, allInAction)

    // Verifica comportamento de Raise
    expect(state.players[3].chips).toBe(0) // Gastou tudo
    expect(state.players[3].currentBet).toBe(1000) // Aposta atual dele

    // O mais importante: A mesa deve reconhecer isso como o novo teto
    expect(state.table.currentBet).toBe(1000)
    expect(state.table.iLastRaiser).toBe(3) // Ele se tornou o agressor

    // Verifica flag de estado (se sua engine implementa isso)
    expect(state.players[3].isAllIn).toBe(true)
  })

  it("Os outros jogadores devem reagir ao All-in como se fosse um Raise", () => {
    // UTG vai All-in de 1000
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 1000 } })

    // Agora é a vez do Dealer (P0).
    // Se fosse um call simples, seria 50 (BB). Mas com o All-in, o "preço" subiu para 1000.

    // Dealer tenta dar apenas "Call". A engine deve cobrar 1000 dele.
    state = gameReducer(state, callAction)

    expect(state.players[0].chips).toBe(0) // Dealer também foi forçado a gastar tudo
    expect(state.players[0].currentBet).toBe(1000)
    expect(state.table.pot).toBe(2075) // 25(SB) + 50(BB) + 1000(UTG) + 1000(Dealer)
  })

  it("Re-Raise All-in (All-in por cima de um Raise)", () => {
    // UTG Raise normal para 200
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 200 } })

    // Dealer tem 1000 e decide ir All-in (Raise para 1000 sobre os 200)
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 1000 } })

    expect(state.table.currentBet).toBe(1000)
    expect(state.table.iLastRaiser).toBe(0) // Dealer agora é o agressor
    expect(state.players[0].chips).toBe(0)

    // A ação volta para o UTG eventualmente?
    // Blinds foldam
    state = gameReducer(state, foldAction) // SB
    state = gameReducer(state, foldAction) // BB

    // UTG precisa pagar a diferença (800) para continuar
    expect(state.table.iCurrentPlayer).toBe(3)
  })

  it("Cenário: Check-Raise All-in no Flop", () => {
    // Setup: Chegar ao FLOP com 2 jogadores (SB vs BB)
    state = gameReducer(state, foldAction) // UTG Fold
    state = gameReducer(state, foldAction) // Dealer Fold
    state = gameReducer(state, callAction) // SB Call
    state = gameReducer(state, checkAction) // BB Check

    expect(state.phase).toBe("FLOP")

    // SB (P1) dá Check para preparar a armadilha
    state = gameReducer(state, checkAction)

    // BB (P2) Aposta 100
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 100 } })

    // SB responde com All-in (Raise maximo)
    // SB tinha 1000 iniciais - 50 investidos = 950 restantes
    const sbAllInAmount = state.players[1].chips
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: sbAllInAmount } }) // All-in de 950

    expect(state.players[1].chips).toBe(0)
    // Aposta total do SB deve ser 950 + 50 (investido antes) = 1000 na rodada?
    // Ou se a engine trata amount como incremento, seria +950.
    // Assumindo lógica de RAISE onde amount é o valor a adicionar:
    expect(state.table.currentBet).toBe(950) // Ou 1000, dependendo da sua engine
    expect(state.table.iLastRaiser).toBe(1) // A ação volta para o BB

    // BB tem que decidir agora se paga o resto da vida dele
    expect(state.table.iCurrentPlayer).toBe(2)
  })

  it("Cenário: All-in menor que a aposta atual (Under-call)", () => {
    // Situação: UTG aposta 500. Dealer tem apenas 100 fichas e quer pagar.
    // Isso é tecnicamente um CALL, mas vira ALL-IN porque ele não cobre a aposta.

    // UTG Raise para 500
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 500 } })
    expect(state.table.currentBet).toBe(550)

    // Dealer (P0) tem apenas 100
    state.players[0].chips = 100

    // Dealer envia ação CALL
    state = gameReducer(state, callAction)

    // Verificações
    expect(state.players[0].chips).toBe(0) // Zerou
    expect(state.players[0].currentBet).toBe(100) // Apostou só o que tinha
    // IMPORTANTE: O currentBet da mesa NÃO deve baixar para 100. Deve continuar 500.
    expect(state.table.currentBet).toBe(550)

    // O próximo jogador (SB) ainda precisa pagar os 500 do UTG, não os 100 do Dealer
    // Se SB der call:
    state = gameReducer(state, callAction)
    expect(state.players[1].currentBet).toBe(550) // SB pagou 500
  })

  it("Cenário: Push-Fold (All-in pré-flop e todos desistem)", () => {
    // UTG vai All-in direto
    const allIn = state.players[3].chips // 1000
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: allIn } })

    // Dealer Folds
    state = gameReducer(state, foldAction)
    // SB Folds
    state = gameReducer(state, foldAction)
    // BB Folds
    state = gameReducer(state, foldAction)

    // UTG deve ganhar imediatamente
    // O jogo deve reiniciar ou ir para Showdown (onde ele ganha por ser único)
    expect(state.phase).toBe("PREFLOP") // Reiniciou

    // O pote anterior (25+50+1000) = 1075 deve ter ido para o UTG
    // UTG (P3) tinha 1000. Apostou 1000. Ganhou blinds (75).
    // Saldo esperado: 1075.
    // Nota: Como o jogo reiniciou, ele pode ter pago blind na nova mão, então checamos > 1000
    expect(state.players[3].chips).toBeGreaterThan(1000)
  })

  it("Cenário: All-in no River (Blefe final)", () => {
    // Simula chegar ao River com Check-Check
    for (let i = 0; i < 12; i++) {
      state = gameReducer(state, callAction)
    } // Preflop->Flop->Turn->River

    expect(state.phase).toBe("RIVER")

    // SB (P1) decide ir All-in no River para tentar expulsar o BB
    // Vamos supor que sobraram 500 fichas
    state.players[1].chips = 500
    state = gameReducer(state, { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: 500 } })

    expect(state.players[1].chips).toBe(0)
    expect(state.table.iCurrentPlayer).toBe(2) // Vez do BB

    // BB Folds
    state = gameReducer(state, foldAction)
    state = gameReducer(state, foldAction) // UTG Folds
    state = gameReducer(state, foldAction) // Dealer Folds

    // SB vence o pote sem mostrar as cartas
    expect(state.phase).toBe("PREFLOP") // Nova rodada
    expect(state.players[1].chips).toBe(500)
  })
})
