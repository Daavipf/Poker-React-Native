import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import { constants } from "./constants"

export default class Utils {
  static setDealerAndBlinds(indiceDealer: number, novosJogadores: player[]) {
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

  static setNextPlayerIndex(indiceJogadorAtivo: number, jogadores: player[]) {
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

  static prepararProximaRodadaDeApostas(state: gameState): gameState {
    // Encontra o primeiro jogador ativo a partir do Dealer
    // NOTA: Aparentemente isso causa um bug que faz o big blind ser o primeiro a cada rodada.
    // Ficar de olho aqui caso haja algum comportamento inesperado
    //const primeiroAposDealer = (state.indiceDealer + 1) % state.jogadores.length
    const proximoJogador = this.setNextPlayerIndex(state.indiceDealer, state.jogadores)

    const jogadoresResetados: player[] = state.jogadores.map((jogador) => {
      if (jogador.saiu || jogador.allIn) {
        return jogador
      }
      return {
        ...jogador,
        apostaNaRodada: 0,
        lastMove: undefined,
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
}
