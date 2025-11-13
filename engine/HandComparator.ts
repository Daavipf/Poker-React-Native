import { card } from "@/types/card"
import HandEvaluator from "./HandEvaluator"

export default class HandComparator {
  static getWinner(hands: card[][]) {
    let iWinner = 0
    for (let i = 1; i < hands.length; i++) {
      const currentHand = hands[i]
      const bestHand = hands[iWinner]
      const desempate = HandComparator.compareHands(currentHand, bestHand)
      if (desempate === 1) {
        iWinner = i
      } else if (desempate === -1) {
        continue
      } else {
        iWinner = i
      }
    }

    return iWinner
  }

  static compareHands(hand1: card[], hand2: card[]): number {
    const hand1Result = HandEvaluator.evaluateHand(hand1)
    const hand2Result = HandEvaluator.evaluateHand(hand2)
    let desempate = 0

    if (hand1Result.nivel > hand2Result.nivel) desempate = 1

    if (hand1Result.nivel < hand2Result.nivel) desempate = -1

    if (hand1Result.nivel === hand2Result.nivel) {
      for (let i = 0; i < hand1Result.kickers.length; i++) {
        if (hand1Result.kickers[i] > hand2Result.kickers[i]) {
          desempate = 1
          break
        }

        if (hand1Result.kickers[i] < hand2Result.kickers[i]) {
          desempate = -1
          break
        }
      }
    }

    return desempate
  }
}
