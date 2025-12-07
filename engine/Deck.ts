import { card } from "@/types/card"
import { deck } from "@/types/deck"
import { constants } from "./constants"

export default class Deck implements deck {
  deck: card[]
  iTopCard: number

  constructor() {
    this.iTopCard = 0
    this.deck = this.shuffleDeck(this.generateDeck())
  }

  restartDeck() {
    this.iTopCard = 0
    this.deck = this.shuffleDeck(this.generateDeck())
  }

  private generateDeck(): card[] {
    let deck = []
    for (const naipe of constants.NAIPES) {
      for (const valor of constants.VALORES) {
        deck.push({
          id: `${valor}${naipe}`,
          valor: valor,
          naipe: naipe,
          peso: this.getWeight(valor),
        })
      }
    }

    return deck
  }

  private shuffleDeck(baralho: card[]) {
    const novoBaralho = [...baralho]
    this.shuffleAlgorithm(novoBaralho)
    return novoBaralho
  }

  private shuffleAlgorithm(array: card[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  private getWeight = (valor: string) => {
    if (valor === "A") return 14
    if (valor === "K") return 13
    if (valor === "Q") return 12
    if (valor === "J") return 11
    return parseInt(valor)
  }

  drawCard(): card {
    return this.deck[this.iTopCard++]
  }

  clone(): deck {
    const newDeck = new Deck()
    newDeck.deck = [...this.deck]
    newDeck.iTopCard = this.iTopCard
    return newDeck
  }
}
