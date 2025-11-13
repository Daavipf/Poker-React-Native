import { card } from "@/types/card"
import HandComparator from "../HandComparator"

describe("HandComparator Tests", () => {
  it("should compare hands correctly", () => {
    const hand1: card[] = [
      { id: "10C", valor: "10", naipe: "C", peso: 10 },
      { id: "JC", valor: "J", naipe: "C", peso: 11 },
      { id: "QC", valor: "Q", naipe: "C", peso: 12 },
      { id: "KC", valor: "K", naipe: "C", peso: 13 },
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
      { id: "7E", valor: "7", naipe: "E", peso: 7 }, // Lixo
      { id: "2O", valor: "2", naipe: "O", peso: 2 }, // Lixo
    ]

    const hand2: card[] = [
      { id: "9C", valor: "9", naipe: "C", peso: 9 },
      { id: "9E", valor: "9", naipe: "E", peso: 9 },
      { id: "9O", valor: "9", naipe: "O", peso: 9 },
      { id: "9P", valor: "9", naipe: "P", peso: 9 }, // Assumindo P como Paus
      { id: "KC", valor: "K", naipe: "C", peso: 13 }, // Kicker
      { id: "2O", valor: "2", naipe: "O", peso: 2 },
      { id: "3E", valor: "3", naipe: "E", peso: 3 },
    ]

    const hands = [hand1, hand2]
    const winner = HandComparator.getWinner(hands)
    expect(winner).toBe(0)
  })
})
