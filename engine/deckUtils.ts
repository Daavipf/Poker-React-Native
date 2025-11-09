import { card } from "@/types/card"
import { player } from "@/types/player"

export default class DeckUtils {
  static shuffleDeck(baralho: card[]) {
    const novoBaralho = [...baralho]
    this.shuffleAlgorithm(novoBaralho)
    return novoBaralho
  }

  private static shuffleAlgorithm(array: card[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  static setPlayersCards(jogadoresAtuais: player[], novoBaralho: card[], indexInicio: number): [player[], number] {
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
}
