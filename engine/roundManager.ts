import { gamePhase } from "@/types/gameState"
import { tempGameState } from "./gameReducer"

export default class RoundManager {
  static advancePhase(currentPhase: gamePhase): gamePhase {
    switch (currentPhase) {
      case "PREFLOP":
        return "FLOP"
      case "FLOP":
        return "TURN"
      case "TURN":
        return "RIVER"
      case "RIVER":
        return "SHOWDOWN"
      case "SHOWDOWN":
        return "PREFLOP"
      default:
        return "PREFLOP"
    }
  }

  static setUpNewPhase(state: tempGameState): tempGameState {
    const newDeck = state.deck.clone()
    const newTable = state.table.clone()
    let newPlayers = state.players.map((player) => player.clone())
    let newMessage = state.message
    let cards

    switch (state.phase) {
      case "PREFLOP":
        newPlayers = newTable.setPlayersHands(newPlayers, newDeck)
        newPlayers = newTable.setDealerAndBlinds(newPlayers)
        break
      case "FLOP":
        cards = [newDeck.drawCard(), newDeck.drawCard(), newDeck.drawCard()]
        newTable.addCards(cards)
        break
      case "TURN":
        cards = [newDeck.drawCard()]
        newTable.addCards(cards)
        break
      case "RIVER":
        cards = [newDeck.drawCard()]
        newTable.addCards(cards)
        break
      case "SHOWDOWN":
        break
      default:
        break
    }

    return {
      ...state,
      deck: newDeck,
      table: newTable,
      players: newPlayers,
      message: newMessage,
    }
  }
}

/*export default class RoundManager {
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
      // const activePlayers = state.jogadores.filter((j) => j.saiu === false)

      // const handResults = activePlayers.map((player) => {
      //   const hand = [...player.mao, ...state.cartasComunitarias]
      //   return {
      //     result: HandEvaluator.evaluateHand(hand),
      //     player,
      //   }
      // })

      // let vencedores = [handResults[0]]
      // for (let i = 1; i < handResults.length; i++) {
      //   const currentHand = handResults[i]
      //   const bestHand = vencedores[0]

      //   if (currentHand.result.nivel < bestHand.result.nivel) continue
      //   if (currentHand.result.nivel > bestHand.result.nivel) {
      //     vencedores = [currentHand]
      //     continue
      //   }

      //   if (currentHand.result.nivel === bestHand.result.nivel) {
      //     // OBS: numeração de mãos: -1 (mão atual); 0 (mãos iguais); 1 (melhor mão que já foi definida)
      //     let desempate = 0

      //     // OBS: os resultados de mãos são objetos com regras pré-definidas, assim, a cada nível, é garantido que
      //     // os arrays de kickers tenham o mesmo tamanho
      //     for (let k = 0; k < bestHand.result.kickers.length; k++) {
      //       if (currentHand.result.kickers[k] > bestHand.result.kickers[k]) {
      //         desempate = -1
      //         break
      //       }
      //       if (currentHand.result.kickers[k] < bestHand.result.kickers[k]) {
      //         desempate = 1
      //         break
      //       }
      //     }

      //     if (desempate === -1) {
      //       vencedores = [currentHand]
      //     } else if (desempate === 0) {
      //       vencedores.push(currentHand)
      //     }
      //   }
      // }

      // const valorPorVencedor = state.pot / vencedores.length

      // vencedores.forEach((vencedor) => {
      //   const jogadorVencedor = stateComCartasNovas.jogadores.find((j) => j.id === vencedor.player.id)
      //   if (jogadorVencedor) {
      //     jogadorVencedor.fichas += valorPorVencedor
      //   }
      // })

      // stateComCartasNovas.pot = 0
      this.evaluateHands(state, stateComCartasNovas)
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

  private static evaluateHands(state: gameState, stateComCartasNovas: gameState) {
    const activePlayers = state.jogadores.filter((j) => j.saiu === false)

    const handResults = activePlayers.map((player) => {
      const hand = [...player.mao, ...state.cartasComunitarias]
      return {
        result: HandEvaluator.evaluateHand(hand),
        player,
      }
    })

    let vencedores = [handResults[0]]
    for (let i = 1; i < handResults.length; i++) {
      const currentHand = handResults[i]
      const bestHand = vencedores[0]

      if (currentHand.result.nivel < bestHand.result.nivel) continue
      if (currentHand.result.nivel > bestHand.result.nivel) {
        vencedores = [currentHand]
        continue
      }

      if (currentHand.result.nivel === bestHand.result.nivel) {
        // OBS: numeração de mãos: -1 (mão atual); 0 (mãos iguais); 1 (melhor mão que já foi definida)
        let desempate = 0

        // OBS: os resultados de mãos são objetos com regras pré-definidas, assim, a cada nível, é garantido que
        // os arrays de kickers tenham o mesmo tamanho
        for (let k = 0; k < bestHand.result.kickers.length; k++) {
          if (currentHand.result.kickers[k] > bestHand.result.kickers[k]) {
            desempate = -1
            break
          }
          if (currentHand.result.kickers[k] < bestHand.result.kickers[k]) {
            desempate = 1
            break
          }
        }

        if (desempate === -1) {
          vencedores = [currentHand]
        } else if (desempate === 0) {
          vencedores.push(currentHand)
        }
      }
    }

    const valorPorVencedor = state.pot / vencedores.length

    vencedores.forEach((vencedor) => {
      const jogadorVencedor = stateComCartasNovas.jogadores.find((j) => j.id === vencedor.player.id)
      if (jogadorVencedor) {
        jogadorVencedor.fichas += valorPorVencedor
      }
    })

    stateComCartasNovas.pot = 0
  }
}
*/
