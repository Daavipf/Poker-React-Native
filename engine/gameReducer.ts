import { card } from "@/types/card"
import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import { constants } from "./constants"
import DeckUtils from "./deckUtils"

interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE" | "CHECK"; amount?: number }
}

export function gameReducer(state: gameState, action: action) {
  switch (action.type) {
    case "INICIAR_RODADA":
      return startRound(state)
    case "ACAO_JOGADOR":
      let novoState: gameState
      const { move, amount } = action.payload!
      if (move == "FOLD") {
        novoState = playerFold(state)
      } else if (move == "CALL") {
        novoState = playerCall(state)
      } else if (move == "RAISE") {
        novoState = playerRaise(state, amount!)
      } else if (move === "CHECK") {
        novoState = playerCheck(state)
      } else {
        novoState = state
      }

      if (novoState.indiceJogadorAtivo === novoState.indiceUltimoRaise) {
        return nextPhase(novoState)
      }

      return novoState
    case "AVANCAR_FASE":
      return nextPhase(state)

    default:
      return state
  }
}

function startRound(state: gameState): gameState {
  const novoBaralho = DeckUtils.shuffleDeck(state.baralho)
  let indexControleBaralho = 0

  const [novosJogadores, indexBaralhoDepoisDosJogadores] = DeckUtils.setPlayersCards(
    state.jogadores,
    novoBaralho,
    indexControleBaralho
  )
  indexControleBaralho = indexBaralhoDepoisDosJogadores

  const [indexDealer, potComBlinds, bigBlindIndex] = setDealerAndBlinds(state.indiceDealer, novosJogadores)

  const indicePrimeiroAJogar = (indexDealer + 2) % novosJogadores.length
  const indiceJogadorAtivo = setNextPlayerIndex(indicePrimeiroAJogar, novosJogadores)

  return {
    ...state,
    baralho: novoBaralho,
    deckIndex: indexControleBaralho,
    indiceDealer: indexDealer,
    jogadores: novosJogadores,
    pot: potComBlinds,
    apostaAtual: constants.BIG_BLIND,
    indiceUltimoRaise: bigBlindIndex,
    fase: "PREFLOP",
    indiceJogadorAtivo: indiceJogadorAtivo,
    cartasComunitarias: [],
  }
}

function setDealerAndBlinds(indiceDealer: number, novosJogadores: player[]) {
  let indexDealer = (indiceDealer + 1) % novosJogadores.length
  const bigBlindIndex = (indexDealer + 2) % novosJogadores.length
  const smallBlindIndex = (indexDealer + 1) % novosJogadores.length

  novosJogadores[indexDealer].role = "Dealer"
  novosJogadores[bigBlindIndex].role = "Big Blind"
  novosJogadores[smallBlindIndex].role = "Small Blind"
  novosJogadores[bigBlindIndex].apostaNaRodada = constants.BIG_BLIND
  novosJogadores[bigBlindIndex].fichas -= constants.BIG_BLIND
  novosJogadores[smallBlindIndex].apostaNaRodada = constants.SMALL_BLIND
  novosJogadores[smallBlindIndex].fichas -= constants.SMALL_BLIND

  const pot = constants.BIG_BLIND + constants.SMALL_BLIND

  const bigBlindRaiseIndex = bigBlindIndex

  return [indexDealer, pot, bigBlindRaiseIndex]
}

function nextPhase(state: gameState): gameState {
  let novaFase = state.fase
  let novoDeckIndex = state.deckIndex
  let novasCartasComunitarias = state.cartasComunitarias
  let stateComCartasNovas = { ...state }

  if (novaFase === "PREFLOP") {
    novaFase = "FLOP"
    const [cartas, index] = setTableCards(state.baralho, state.deckIndex)
    novasCartasComunitarias = cartas
    novoDeckIndex = index
  } else if (novaFase === "FLOP") {
    novaFase = "TURN"
    const [cartas, index] = setNewTableCard(state.baralho, state.cartasComunitarias, state.deckIndex)
    novasCartasComunitarias = cartas
    novoDeckIndex = index
  } else if (novaFase === "TURN") {
    novaFase = "RIVER"
    const [cartas, index] = setNewTableCard(state.baralho, state.cartasComunitarias, state.deckIndex)
    novasCartasComunitarias = cartas
    novoDeckIndex = index
  } else if (novaFase === "RIVER") {
    novaFase = "SHOWDOWN"
    // TODO: lógica de distribuição de pot
  } else if (novaFase === "SHOWDOWN") {
    return startRound(state)
  }

  stateComCartasNovas = {
    ...state,
    fase: novaFase,
    deckIndex: novoDeckIndex,
    cartasComunitarias: novasCartasComunitarias,
  }

  if (stateComCartasNovas.fase !== "SHOWDOWN") {
    return prepararProximaRodadaDeApostas(stateComCartasNovas)
  } else {
    return stateComCartasNovas
  }
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
  let deckIndex = indexInicio
  cartasComunitarias.push(baralho[deckIndex++])
  return [cartasComunitarias, deckIndex]
}

function prepararProximaRodadaDeApostas(state: gameState): gameState {
  // Encontra o primeiro jogador ativo a partir do Dealer
  // NOTA: Aparentemente isso causa um bug que faz o big blind ser o primeiro a cada rodada.
  // Ficar de olho aqui caso haja algum comportamento inesperado
  //const primeiroAposDealer = (state.indiceDealer + 1) % state.jogadores.length
  const proximoJogador = setNextPlayerIndex(state.indiceDealer, state.jogadores)

  const jogadoresResetados = state.jogadores.map((jogador) => {
    if (jogador.saiu || jogador.allIn) {
      return jogador
    }
    return {
      ...jogador,
      apostaNaRodada: 0,
    }
  })

  return {
    ...state,
    jogadores: jogadoresResetados,
    apostaAtual: 0,
    indiceJogadorAtivo: proximoJogador,
    indiceUltimoRaise: proximoJogador,
  }
}

function playerFold(state: gameState): gameState {
  const novosJogadores = state.jogadores.map((jogador, index) => {
    if (index === state.indiceJogadorAtivo) {
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

  const stateComLastSurvivor = checkForLastSurvivor(novosJogadores, state)
  if (stateComLastSurvivor) {
    return stateComLastSurvivor
  }

  const indiceProximoJogador = setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

  if (indiceProximoJogador === state.indiceUltimoRaise) {
    return nextPhase({ ...state, jogadores: novosJogadores, indiceJogadorAtivo: indiceProximoJogador })
  }

  return { ...state, jogadores: novosJogadores, indiceJogadorAtivo: indiceProximoJogador }
}

function checkForLastSurvivor(novosJogadores: player[], state: gameState): gameState | undefined {
  const jogadoresAtivos = novosJogadores.filter((j) => j.saiu === false)
  const countJogadoresAtivos = jogadoresAtivos.length

  if (countJogadoresAtivos === 1) {
    const vencedor = jogadoresAtivos[0]
    console.log(`[REDUCER]: FIM DA MÃO. ${vencedor.nome} é o último sobrevivente e ganha ${state.pot}`)

    const jogadoresComPoteNoVencedor = novosJogadores.map((j) => {
      if (j.id === vencedor.id) {
        return { ...j, fichas: j.fichas + state.pot }
      }
      return j
    })

    return startRound({ ...state, jogadores: jogadoresComPoteNoVencedor, pot: 0 })
  }
}

function playerRaise(state: gameState, amount: number) {
  let jogadorAtual = state.jogadores[state.indiceJogadorAtivo]

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
    indiceUltimoRaise: state.indiceJogadorAtivo,
    indiceJogadorAtivo: novoIndiceJogador,
  }
}

function playerCall(state: gameState): gameState {
  let jogadorAtual = state.jogadores[state.indiceJogadorAtivo]
  const custoRealAposta = state.apostaAtual - jogadorAtual.apostaNaRodada

  if (custoRealAposta > jogadorAtual.fichas) {
    // TODO implementar lógica de All-in
    const fichasReais = jogadorAtual.fichas
    const novosJogadores = state.jogadores.map((jogador, index) => {
      if (index === state.indiceJogadorAtivo) {
        return {
          ...jogador,
          fichas: 0,
          apostaNaRodada: jogadorAtual.apostaNaRodada + fichasReais,
          allIn: true,
        }
      } else {
        return jogador
      }
    })

    const novoIndiceJogador = setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

    return {
      ...state,
      jogadores: novosJogadores,
      pot: state.pot + fichasReais,
      indiceJogadorAtivo: novoIndiceJogador,
    }
  }

  const novosJogadores = state.jogadores.map((jogador, index) => {
    if (index === state.indiceJogadorAtivo) {
      return {
        ...jogador,
        fichas: jogador.fichas - custoRealAposta,
        apostaNaRodada: state.apostaAtual,
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
    indiceJogadorAtivo: novoIndiceJogador,
  }
}

function playerCheck(state: gameState): gameState {
  const jogadorAtual = state.jogadores[state.indiceJogadorAtivo]

  if (jogadorAtual.apostaNaRodada !== state.apostaAtual) {
    console.error("CHECK inválido: Aposta não coberta.")
    return state
  }

  const novoIndiceJogador = setNextPlayerIndex(state.indiceJogadorAtivo, state.jogadores)

  return {
    ...state,
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
