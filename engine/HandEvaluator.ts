import { card } from "@/types/card"

export interface result {
  nivel: number
  nome:
    | "Royal Flush"
    | "Straight Flush"
    | "Four of a Kind"
    | "Full House"
    | "Flush"
    | "Straight"
    | "Three of a Kind"
    | "Two Pair"
    | "Pair"
    | "High Card"
    | "None"
  kickers: number[]
}

interface suitsMap {
  [key: string]: card[]
}

interface valuesMap {
  [key: number]: number
}

export default class HandEvaluator {
  static evaluateHand(hand: card[]): result {
    const suitsMap = this.getSuitsMap(hand)
    const valuesMap = this.getValuesMap(hand)

    const royalFlushResult = this.isRoyalFlush(suitsMap)
    if (royalFlushResult.isRoyal) {
      return { nivel: 10, nome: "Royal Flush", kickers: [] }
    }

    const straightFlushResult = this.isStraightFlush(suitsMap)
    if (straightFlushResult.isStraightFlush) {
      return { nivel: 9, nome: "Straight Flush", kickers: [straightFlushResult.highCard] }
    }

    const quadraResult = this.isFourOfAKind(valuesMap)
    if (quadraResult.isQuadra) {
      return { nivel: 8, nome: "Four of a Kind", kickers: quadraResult.kickers }
    }

    const fullHouseResult = this.isFullHouse(valuesMap)
    if (fullHouseResult.isFullHouse) {
      return { nivel: 7, nome: "Full House", kickers: fullHouseResult.kickers }
    }

    const flushResult = this.isFlush(suitsMap)
    if (flushResult.isFlush) {
      return { nivel: 6, nome: "Flush", kickers: flushResult.kickers }
    }

    const straightResult = this.isStraight(valuesMap)
    if (straightResult.isStraight) {
      return { nivel: 5, nome: "Straight", kickers: [straightResult.highCard] }
    }

    const trincaResult = this.isThreeOfAKind(valuesMap)
    if (trincaResult.isTrinca) {
      return { nivel: 4, nome: "Three of a Kind", kickers: trincaResult.kickers }
    }

    const twoPairResult = this.isTwoPair(valuesMap)
    if (twoPairResult.isTwoPair) {
      return { nivel: 3, nome: "Two Pair", kickers: twoPairResult.kickers }
    }

    const pairResult = this.isPair(valuesMap)
    if (pairResult.isPair) {
      return { nivel: 2, nome: "Pair", kickers: pairResult.kickers }
    }

    const highCardKickers = this.getKickers(valuesMap, [], 5)
    return { nivel: 1, nome: "High Card", kickers: highCardKickers }
  }

  private static getSuitsMap(hand: card[]) {
    let result: suitsMap = {}

    for (const card of hand) {
      if (!result[card.naipe]) result[card.naipe] = []

      result[card.naipe].push(card)
    }

    return result
  }

  private static getValuesMap(hand: card[]) {
    let result: valuesMap = {}

    for (const card of hand) {
      result[card.peso] = (result[card.peso] || 0) + 1
    }

    return result
  }

  private static isRoyalFlush(suitsMap: suitsMap): { isRoyal: boolean } {
    for (const key in suitsMap) {
      if (suitsMap[key].length >= 5) {
        const flushCards = suitsMap[key]

        const pesosDoFlush = flushCards.map((card) => card.peso)

        const has10 = pesosDoFlush.includes(10)
        const hasJ = pesosDoFlush.includes(11)
        const hasQ = pesosDoFlush.includes(12)
        const hasK = pesosDoFlush.includes(13)
        const hasA = pesosDoFlush.includes(14)

        if (has10 && hasJ && hasQ && hasK && hasA) {
          return { isRoyal: true }
        }
      }
    }

    return { isRoyal: false }
  }

  private static isStraightFlush(suitsMap: suitsMap): { isStraightFlush: boolean; highCard: number } {
    for (const key in suitsMap) {
      if (suitsMap[key].length >= 5) {
        const flushCards = suitsMap[key]
        const valuesMap = this.getValuesMap(flushCards)

        const straightResult = this.isStraight(valuesMap)
        if (straightResult.isStraight) {
          return { isStraightFlush: true, highCard: straightResult.highCard }
        }
      }
    }

    return { isStraightFlush: false, highCard: -1 }
  }

  private static isStraight(valuesMap: valuesMap) {
    let keys = this.getValuesMapKeysArray(valuesMap)
    if (this.checkWheel(keys)) return { isStraight: true, highCard: 5 }
    let result = { isStraight: false, highCard: -1 }

    for (let i = 0; i <= keys.length - 5; i++) {
      const subArray = keys.slice(i, i + 5)
      let highCard = subArray[4]
      let lowCard = subArray[0]

      if (subArray.length === 5 && highCard - lowCard === 4) {
        result = { isStraight: true, highCard: highCard }
      }
    }

    return result
  }

  private static getValuesMapKeysArray(valuesMap: valuesMap) {
    let keys = []
    for (const key in valuesMap) {
      keys.push(parseInt(key))
    }

    keys.sort((a, b) => a - b)

    return keys
  }

  private static checkWheel(keys: number[]) {
    if (keys.includes(14) && keys.includes(2) && keys.includes(3) && keys.includes(4) && keys.includes(5)) {
      return true
    }

    return false
  }

  private static isFlush(suitsMap: suitsMap): { isFlush: boolean; kickers: number[] } {
    for (const key in suitsMap) {
      if (suitsMap[key].length >= 5) {
        const flushCards = suitsMap[key]
        const kickers = flushCards
          .map((card) => card.peso)
          .sort((a, b) => b - a)
          .slice(0, 5)

        return { isFlush: true, kickers: kickers }
      }
    }

    return { isFlush: false, kickers: [] }
  }

  private static isFourOfAKind(valuesMap: valuesMap): { isQuadra: boolean; kickers: number[] } {
    const quadras = this.getGroups(valuesMap, 4)

    if (quadras.length === 0) {
      return { isQuadra: false, kickers: [] }
    }

    const quadWeight = quadras[0]
    const kickers = this.getKickers(valuesMap, [quadWeight], 1)

    return { isQuadra: true, kickers: kickers }
  }

  private static isFullHouse(valuesMap: valuesMap): { isFullHouse: boolean; kickers: number[] } {
    const pesosTrincas: number[] = []
    const pesosPares: number[] = []
    for (const key in valuesMap) {
      const count = valuesMap[key]
      const peso = parseInt(key)

      if (count === 3) {
        pesosTrincas.push(peso)
      }
      if (count === 2) {
        pesosPares.push(peso)
      }
    }

    if (pesosTrincas.length >= 1 && pesosPares.length >= 1) {
      return { isFullHouse: true, kickers: [pesosTrincas[0], pesosPares[0]] }
    }

    if (pesosTrincas.length >= 2) {
      return { isFullHouse: true, kickers: [pesosTrincas[0], pesosTrincas[1]] }
    }

    return { isFullHouse: false, kickers: [] }
  }

  private static isThreeOfAKind(valuesMap: valuesMap): { isTrinca: boolean; kickers: number[] } {
    const trincas = this.getGroups(valuesMap, 3)

    if (trincas.length === 0) {
      return { isTrinca: false, kickers: [] }
    }

    const trincaWeight = trincas[0]
    const kickers = this.getKickers(valuesMap, [trincaWeight], 2)

    return { isTrinca: true, kickers: [trincaWeight, ...kickers] }
  }

  private static isTwoPair(valuesMap: valuesMap): { isTwoPair: boolean; kickers: number[] } {
    const twoPair = this.getGroups(valuesMap, 2)

    if (twoPair.length < 2) {
      return { isTwoPair: false, kickers: [] }
    }

    const highPair = twoPair[0]
    const lowPair = twoPair[1]

    const kickers = this.getKickers(valuesMap, [highPair, lowPair], 1)

    return { isTwoPair: true, kickers: [highPair, lowPair, ...kickers] }
  }

  private static isPair(valuesMap: valuesMap): { isPair: boolean; kickers: number[] } {
    const pair = this.getGroups(valuesMap, 2)

    if (pair.length === 0) {
      return { isPair: false, kickers: [] }
    }

    const pairWeight = pair[0]
    const kickers = this.getKickers(valuesMap, [pairWeight], 3)

    return { isPair: true, kickers: [pairWeight, ...kickers] }
  }

  private static getGroups(valuesMap: valuesMap, kind: number): number[] {
    const groups: number[] = []
    for (const key in valuesMap) {
      if (valuesMap[key] === kind) {
        groups.push(parseInt(key))
      }
    }
    return groups.sort((a, b) => b - a)
  }

  private static getKickers(valuesMap: valuesMap, excludeWeights: number[], numKickers: number): number[] {
    const kickers: number[] = []
    const sortedKeys = this.getValuesMapKeysArray(valuesMap).reverse()

    for (const key of sortedKeys) {
      if (!excludeWeights.includes(key) && valuesMap[key] === 1) {
        kickers.push(key)
        if (kickers.length === numKickers) {
          break
        }
      }
    }
    return kickers
  }
}
