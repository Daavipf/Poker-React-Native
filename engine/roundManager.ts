import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import { constants } from "./constants"
import DeckUtils from "./deckUtils"
import Utils from "./utils"

export default class RoundManager {
  static startRound(state: gameState): gameState {
    const novoBaralho = DeckUtils.shuffleDeck(state.baralho)
    let indexControleBaralho = 0

    const [novosJogadores, indexBaralhoDepoisDosJogadores] = DeckUtils.setPlayersCards(
      state.jogadores,
      novoBaralho,
      indexControleBaralho
    )
    indexControleBaralho = indexBaralhoDepoisDosJogadores

    const [indexDealer, potComBlinds, bigBlindIndex] = Utils.setDealerAndBlinds(state.indiceDealer, novosJogadores)

    const indicePrimeiroAJogar = (indexDealer + 2) % novosJogadores.length
    const indiceJogadorAtivo = Utils.setNextPlayerIndex(indicePrimeiroAJogar, novosJogadores)

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

  static nextPhase(state: gameState): gameState {
    let novaFase = state.fase
    let novoDeckIndex = state.deckIndex
    let novasCartasComunitarias = state.cartasComunitarias
    let stateComCartasNovas = { ...state }

    if (novaFase === "PREFLOP") {
      novaFase = "FLOP"
      const [cartas, index] = DeckUtils.setTableCards(state.baralho, state.deckIndex)
      novasCartasComunitarias = cartas
      novoDeckIndex = index
    } else if (novaFase === "FLOP") {
      novaFase = "TURN"
      const [cartas, index] = DeckUtils.setNewTableCard(state.baralho, state.cartasComunitarias, state.deckIndex)
      novasCartasComunitarias = cartas
      novoDeckIndex = index
    } else if (novaFase === "TURN") {
      novaFase = "RIVER"
      const [cartas, index] = DeckUtils.setNewTableCard(state.baralho, state.cartasComunitarias, state.deckIndex)
      novasCartasComunitarias = cartas
      novoDeckIndex = index
    } else if (novaFase === "RIVER") {
      novaFase = "SHOWDOWN"
      // TODO: lógica de distribuição de pot
    } else if (novaFase === "SHOWDOWN") {
      return this.startRound(state)
    }

    stateComCartasNovas = {
      ...state,
      fase: novaFase,
      deckIndex: novoDeckIndex,
      cartasComunitarias: novasCartasComunitarias,
    }

    if (stateComCartasNovas.fase !== "SHOWDOWN") {
      return Utils.prepararProximaRodadaDeApostas(stateComCartasNovas)
    } else {
      return stateComCartasNovas
    }
  }

  static checkForLastSurvivor(novosJogadores: player[], state: gameState): gameState | undefined {
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

      return RoundManager.startRound({ ...state, jogadores: jogadoresComPoteNoVencedor, pot: 0 })
    }
  }
}
