import { card } from "@/types/card"
import { gameState } from "@/types/gameState"
import { player } from "@/types/player"

interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK"; amount?: number }
}

const BIG_BLIND = 50
const SMALL_BLIND = 25

export function gameReducer(state: gameState, action: action) {
  switch (action.type) {
    case "INICIAR_RODADA":
      // const [novoBaralho, deckIndex, indexDealer, novosJogadores] = startRound(
      //   state.baralho,
      //   state.indiceDealer,
      //   state.jogadores
      // )
      const novoState = startRound(state)

      //return { ...state, baralho: novoBaralho, deckIndex, indiceDealer: indexDealer, jogadores: novosJogadores }
      return novoState
    case "ACAO_JOGADOR":
      const { move, amount } = action.payload!
      if (move == "FOLD") {
        const novosJogadores = playerFold(state.jogadores, state.indiceJogadorAtivo)
        const novoIndiceJogador = setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

        return { ...state, jogadores: novosJogadores, indiceJogadorAtivo: novoIndiceJogador }
      }
      if (move == "CALL") {
        /* TODO */
      }
      if (move == "RAISE") {
        // let jogadorAtual = state.jogadores[state.indiceJogadorAtivo]

        // if (amount! <= state.apostaAtual) {
        //   console.error("Raise inválido: valor menor ou igual à aposta atual.")
        //   return state // Ação ilegal, retorna o estado sem mudar
        // }

        // const custoRealAposta = amount! - jogadorAtual.apostaNaRodada

        // if (custoRealAposta > jogadorAtual.fichas) {
        //   console.error("Raise inválido: fichas insuficientes.")
        //   // NOTA: Aqui entraria a lógica de ALL-IN
        //   return state // Por enquanto, apenas ignora
        // }

        // const novosJogadores = state.jogadores.map((jogador, index) => {
        //   if (index === state.indiceJogadorAtivo) {
        //     return {
        //       ...jogador,
        //       apostaNaRodada: amount!,
        //       fichas: jogador.fichas - custoRealAposta,
        //     }
        //   } else {
        //     return jogador
        //   }
        // })
        const novoState = playerRaise(state, amount!)

        //const novoIndiceJogador = setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)
        //console.log(state)

        return novoState
      }
      return state
    case "AVANCAR_FASE":
      let novaFase = state.fase
      if (novaFase == "PREFLOP") {
        novaFase = "FLOP"
        const baralho = state.baralho
        let indexAtual = state.deckIndex

        const [cartasComunitarias, indexDepoisDaMesa] = setTableCards(baralho, indexAtual)
        indexAtual = indexDepoisDaMesa

        return { ...state, fase: novaFase, deckIndex: indexAtual, cartasComunitarias }
      } else if (novaFase == "FLOP") {
        novaFase = "TURN"
        const [cartasComunitarias, indexDepoisDaMesa] = setNewTableCard(
          state.baralho,
          state.cartasComunitarias,
          state.deckIndex
        )

        return { ...state, fase: novaFase, deckIndex: indexDepoisDaMesa, cartasComunitarias }
      } else if (novaFase == "TURN") {
        novaFase = "RIVER"
        const [cartasComunitarias, indexDepoisDaMesa] = setNewTableCard(
          state.baralho,
          state.cartasComunitarias,
          state.deckIndex
        )

        return { ...state, fase: novaFase, deckIndex: indexDepoisDaMesa, cartasComunitarias }
      } else if (novaFase == "RIVER") {
        novaFase = "SHOWDOWN"
      } else if (novaFase == "SHOWDOWN") {
        novaFase = "PREFLOP"
        // const [novoBaralho, deckIndex, indexDealer, novosJogadores] = startRound(
        //   state.baralho,
        //   state.indiceDealer,
        //   state.jogadores
        // )
        const novoState = startRound(state)
        // const cartasComunitarias: card[] = []
        // const pot = 0
        novoState.cartasComunitarias = []
        novoState.pot = 0
        novoState.fase = novaFase
        return novoState

        // return {
        //   ...state,
        //   baralho: novoBaralho,
        //   cartasComunitarias,
        //   pot,
        //   deckIndex,
        //   indiceDealer: indexDealer,
        //   jogadores: novosJogadores,
        //   fase: novaFase,
        // }
      }
      return { ...state, fase: novaFase }
    default:
      return state
  }
}

function startRound(state: gameState): gameState {
  const novoBaralho = shuffleDeck(state.baralho)
  let indexAtual = 0

  const [novosJogadores, indexDepoisDosJogadores] = setPlayersCards(state.jogadores, novoBaralho, indexAtual)
  indexAtual = indexDepoisDosJogadores

  let indexDealer = (state.indiceDealer + 1) % novosJogadores.length
  const bigBlindIndex = (indexDealer + 1) % novosJogadores.length
  const smallBlindIndex = (indexDealer + 2) % novosJogadores.length

  novosJogadores[indexDealer].role = "Dealer"
  novosJogadores[bigBlindIndex].role = "Big Blind"
  novosJogadores[smallBlindIndex].role = "Small Blind"
  novosJogadores[bigBlindIndex].apostaNaRodada = BIG_BLIND
  novosJogadores[bigBlindIndex].fichas -= BIG_BLIND
  novosJogadores[smallBlindIndex].apostaNaRodada = SMALL_BLIND
  novosJogadores[smallBlindIndex].fichas -= SMALL_BLIND

  return { ...state, baralho: novoBaralho, deckIndex: indexAtual, indiceDealer: indexDealer, jogadores: novosJogadores }
}

function shuffleDeck(baralho: card[]) {
  const novoBaralho = [...baralho]
  shuffleAlgorithm(novoBaralho)
  return novoBaralho
}

function shuffleAlgorithm(array: card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

function setPlayersCards(jogadoresAtuais: player[], novoBaralho: card[], indexInicio: number): [player[], number] {
  let deckIndex = indexInicio
  const novosJogadores = jogadoresAtuais.map((jogador) => {
    return {
      ...jogador,
      mao: [novoBaralho[deckIndex++], novoBaralho[deckIndex++]],
      saiu: false,
      allIn: false,
      apostaAtual: 0,
    }
  })
  return [novosJogadores, deckIndex]
}

function setTableCards(novoBaralho: card[], indexInicio: number): [card[], number] {
  let cartasComunitarias = []
  let deckIndex = indexInicio
  for (let i = 0; i < 3; i++) {
    cartasComunitarias.push(novoBaralho[deckIndex++])
  }
  return [cartasComunitarias, deckIndex]
}

function setNewTableCard(baralho: card[], cartasComunitarias: card[], indexInicio: number): [card[], number] {
  //let cartasComunitarias = []
  let deckIndex = indexInicio
  cartasComunitarias.push(baralho[deckIndex++])
  return [cartasComunitarias, deckIndex]
}

function playerFold(jogadores: player[], indiceJogadorAtivo: number) {
  const novosJogadores = jogadores.map((jogador, index) => {
    if (index === indiceJogadorAtivo) {
      return {
        ...jogador,
        apostaAtual: 0,
        mao: [],
        saiu: true,
      }
    } else {
      return jogador
    }
  })

  return novosJogadores
}

function playerRaise(state: gameState, amount: number) {
  let jogadorAtual = state.jogadores[state.indiceJogadorAtivo]

  /*if (amount! <= state.apostaAtual) {
    console.error("Raise inválido: valor menor ou igual à aposta atual.")
    return state // Ação ilegal, retorna o estado sem mudar
  }*/

  //const custoRealAposta = amount! - jogadorAtual.apostaNaRodada
  const custoRealAposta = amount + state.apostaAtual

  if (custoRealAposta > jogadorAtual.fichas) {
    console.error("Raise inválido: fichas insuficientes.")
    // NOTA: Aqui entraria a lógica de ALL-IN
    return state // Por enquanto, apenas ignora
  }
  const novosJogadores = state.jogadores.map((jogador, index) => {
    if (index === state.indiceJogadorAtivo) {
      return {
        ...jogador,
        apostaNaRodada: amount!,
        fichas: jogador.fichas - custoRealAposta,
      }
    } else {
      return jogador
    }
  })

  const novoIndiceJogador = setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

  return {
    ...state,
    jogadores: novosJogadores,
    pot: state.pot + custoRealAposta,
    apostaAtual: custoRealAposta,
    ultimoRaise: state.indiceJogadorAtivo,
    indiceJogadorAtivo: novoIndiceJogador,
  }
}

function setNextPlayerIndex(indiceJogadorAtivo: number, jogadores: player[]) {
  let proximoIndice = (indiceJogadorAtivo + 1) % jogadores.length

  while (jogadores[proximoIndice].saiu || jogadores[proximoIndice].allIn) {
    proximoIndice = (proximoIndice + 1) % jogadores.length

    if (proximoIndice === indiceJogadorAtivo) {
      // Revisar lógica de fim de rodada
      // Ou todos os jogadores saíram
      return proximoIndice
    }
  }

  return proximoIndice
}
