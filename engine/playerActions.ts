import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import RoundManager from "./roundManager"
import Utils from "./utils"

export default class PlayerActions {
  static playerFold(state: gameState): gameState {
    const novosJogadores: player[] = state.jogadores.map((jogador, index) => {
      if (index === state.indiceJogadorAtivo) {
        return {
          ...jogador,
          apostaAtual: 0,
          mao: [],
          saiu: true,
          lastMove: "FOLD",
        }
      } else {
        return jogador
      }
    })

    const stateComLastSurvivor = RoundManager.checkForLastSurvivor(novosJogadores, state)
    if (stateComLastSurvivor) {
      return stateComLastSurvivor
    }

    const indiceProximoJogador = Utils.setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

    // if (indiceProximoJogador === state.indiceUltimoRaise) {
    //   return RoundManager.nextPhase({ ...state, jogadores: novosJogadores, indiceJogadorAtivo: indiceProximoJogador })
    // }

    return { ...state, jogadores: novosJogadores, indiceJogadorAtivo: indiceProximoJogador }
  }

  static playerRaise(state: gameState, amount: number) {
    let jogadorAtual = state.jogadores[state.indiceJogadorAtivo]

    const custoRealAposta = amount + state.apostaAtual

    if (custoRealAposta > jogadorAtual.fichas) {
      console.error("Raise inválido: fichas insuficientes.")
      // NOTA: Aqui entraria a lógica de ALL-IN
      return state // Por enquanto, apenas ignora
    }
    const novosJogadores: player[] = state.jogadores.map((jogador, index) => {
      if (index === state.indiceJogadorAtivo) {
        return {
          ...jogador,
          apostaNaRodada: custoRealAposta!,
          fichas: jogador.fichas - custoRealAposta,
          lastMove: "RAISE",
        }
      } else {
        return jogador
      }
    })

    const novoIndiceJogador = Utils.setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

    return {
      ...state,
      jogadores: novosJogadores,
      pot: state.pot + custoRealAposta,
      apostaAtual: custoRealAposta,
      indiceUltimoRaise: state.indiceJogadorAtivo,
      indiceJogadorAtivo: novoIndiceJogador,
    }
  }

  static playerCall(state: gameState): gameState {
    let jogadorAtual = state.jogadores[state.indiceJogadorAtivo]
    const custoRealAposta = state.apostaAtual - jogadorAtual.apostaNaRodada

    if (custoRealAposta > jogadorAtual.fichas) {
      // TODO implementar lógica de All-in
      const fichasReais = jogadorAtual.fichas
      const novosJogadores: player[] = state.jogadores.map((jogador, index) => {
        if (index === state.indiceJogadorAtivo) {
          return {
            ...jogador,
            fichas: 0,
            apostaNaRodada: jogadorAtual.apostaNaRodada + fichasReais,
            allIn: true,
            lastMove: "CALL",
          }
        } else {
          return jogador
        }
      })

      const novoIndiceJogador = Utils.setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

      return {
        ...state,
        jogadores: novosJogadores,
        pot: state.pot + fichasReais,
        indiceJogadorAtivo: novoIndiceJogador,
      }
    }

    const novosJogadores: player[] = state.jogadores.map((jogador, index) => {
      if (index === state.indiceJogadorAtivo) {
        return {
          ...jogador,
          fichas: jogador.fichas - custoRealAposta,
          apostaNaRodada: state.apostaAtual,
          lastMove: "CALL",
        }
      } else {
        return jogador
      }
    })

    const novoIndiceJogador = Utils.setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

    return {
      ...state,
      jogadores: novosJogadores,
      pot: state.pot + custoRealAposta,
      indiceJogadorAtivo: novoIndiceJogador,
    }
  }

  static playerCheck(state: gameState): gameState {
    const jogadorAtual = state.jogadores[state.indiceJogadorAtivo]

    if (jogadorAtual.apostaNaRodada !== state.apostaAtual) {
      console.error("CHECK inválido: Aposta não coberta.")
      return state
    }

    const novosJogadores: player[] = state.jogadores.map((jogador, index) => {
      if (index === state.indiceJogadorAtivo) {
        return {
          ...jogador,
          lastMove: "CHECK",
        }
      } else {
        return jogador
      }
    })

    const novoIndiceJogador = Utils.setNextPlayerIndex(state.indiceJogadorAtivo, novosJogadores)

    return {
      ...state,
      indiceJogadorAtivo: novoIndiceJogador,
      jogadores: novosJogadores,
    }
  }
}
