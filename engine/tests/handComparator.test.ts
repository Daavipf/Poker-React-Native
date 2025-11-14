import { card } from "@/types/card"
import HandComparator from "../HandComparator"

const RoyalFlushHand: card[] = [
  { id: "10C", valor: "10", naipe: "C", peso: 10 },
  { id: "JC", valor: "J", naipe: "C", peso: 11 },
  { id: "QC", valor: "Q", naipe: "C", peso: 12 },
  { id: "KC", valor: "K", naipe: "C", peso: 13 },
  { id: "AC", valor: "A", naipe: "C", peso: 14 },
  { id: "7E", valor: "7", naipe: "E", peso: 7 }, // Lixo
  { id: "2O", valor: "2", naipe: "O", peso: 2 }, // Lixo
]

const StraightFlushHand: card[] = [
  { id: "9C", valor: "9", naipe: "C", peso: 9 },
  { id: "8C", valor: "8", naipe: "C", peso: 8 },
  { id: "7C", valor: "7", naipe: "C", peso: 7 },
  { id: "6C", valor: "6", naipe: "C", peso: 6 },
  { id: "5C", valor: "5", naipe: "C", peso: 5 },
  { id: "4C", valor: "4", naipe: "C", peso: 4 },
  { id: "3C", valor: "3", naipe: "C", peso: 3 },
]

const StraightFlushHand1: card[] = [
  { id: "10C", valor: "10", naipe: "C", peso: 10 },
  { id: "9C", valor: "9", naipe: "C", peso: 9 },
  { id: "8C", valor: "8", naipe: "C", peso: 8 },
  { id: "7C", valor: "7", naipe: "C", peso: 7 },
  { id: "6C", valor: "6", naipe: "C", peso: 6 },
  { id: "4C", valor: "4", naipe: "C", peso: 4 },
  { id: "3C", valor: "3", naipe: "C", peso: 3 },
]

const FourOfAKindHand: card[] = [
  { id: "9C", valor: "9", naipe: "C", peso: 9 },
  { id: "9E", valor: "9", naipe: "E", peso: 9 },
  { id: "9O", valor: "9", naipe: "O", peso: 9 },
  { id: "9P", valor: "9", naipe: "P", peso: 9 },
  { id: "KC", valor: "K", naipe: "C", peso: 13 },
  { id: "2O", valor: "2", naipe: "O", peso: 2 },
  { id: "3E", valor: "3", naipe: "E", peso: 3 },
]

const FourOfAKindHand2: card[] = [
  { id: "6C", valor: "6", naipe: "C", peso: 6 },
  { id: "6E", valor: "6", naipe: "E", peso: 6 },
  { id: "6O", valor: "6", naipe: "O", peso: 6 },
  { id: "6P", valor: "6", naipe: "P", peso: 6 },
  { id: "KC", valor: "K", naipe: "C", peso: 13 },
  { id: "2O", valor: "2", naipe: "O", peso: 2 },
  { id: "3E", valor: "3", naipe: "E", peso: 3 },
]

describe("HandComparator Tests", () => {
  it("should compare hands correctly", () => {
    const hands = [RoyalFlushHand, FourOfAKindHand]
    const winner = HandComparator.getWinner(hands)
    expect(winner).toBe(0)
  })

  it("should compare similar hands correctly", () => {
    const hands = [FourOfAKindHand2, FourOfAKindHand]
    const winner = HandComparator.getWinner(hands)
    expect(winner).toBe(1)
  })

  it("should compare similar straight hands correctly", () => {
    const hands = [StraightFlushHand, StraightFlushHand1]
    const winner = HandComparator.getWinner(hands)
    expect(winner).toBe(1)
  })
})
