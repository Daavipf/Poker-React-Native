import { card } from "@/types/card"
import HandEvaluator, { result } from "../HandEvaluator"

describe("HandEvaluator Tests", () => {
  // 10. Royal Flush
  // Sequência A, K, Q, J, 10 do mesmo naipe
  it("should evaluate a Royal Flush correctly", () => {
    const hand: card[] = [
      { id: "10C", valor: "10", naipe: "C", peso: 10 },
      { id: "JC", valor: "J", naipe: "C", peso: 11 },
      { id: "QC", valor: "Q", naipe: "C", peso: 12 },
      { id: "KC", valor: "K", naipe: "C", peso: 13 },
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
      { id: "7E", valor: "7", naipe: "E", peso: 7 }, // Lixo
      { id: "2O", valor: "2", naipe: "O", peso: 2 }, // Lixo
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(10)
    expect(result.nome).toBe("Royal Flush")
  })

  // 9. Straight Flush
  // Sequência numérica (ex: 5, 6, 7, 8, 9) do mesmo naipe
  it("should evaluate a Straight Flush correctly", () => {
    const hand: card[] = [
      { id: "9E", valor: "9", naipe: "E", peso: 9 },
      { id: "8E", valor: "8", naipe: "E", peso: 8 },
      { id: "7E", valor: "7", naipe: "E", peso: 7 },
      { id: "6E", valor: "6", naipe: "E", peso: 6 },
      { id: "5E", valor: "5", naipe: "E", peso: 5 },
      { id: "AC", valor: "A", naipe: "C", peso: 14 }, // Lixo
      { id: "KO", valor: "K", naipe: "O", peso: 13 }, // Lixo
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(9)
    expect(result.nome).toBe("Straight Flush")
  })

  // 8. Four of a Kind (Quadra)
  // Quatro cartas do mesmo valor/peso
  it("should evaluate Four of a Kind correctly", () => {
    const hand: card[] = [
      { id: "9C", valor: "9", naipe: "C", peso: 9 },
      { id: "9E", valor: "9", naipe: "E", peso: 9 },
      { id: "9O", valor: "9", naipe: "O", peso: 9 },
      { id: "9P", valor: "9", naipe: "P", peso: 9 }, // Assumindo P como Paus
      { id: "KC", valor: "K", naipe: "C", peso: 13 }, // Kicker
      { id: "2O", valor: "2", naipe: "O", peso: 2 },
      { id: "3E", valor: "3", naipe: "E", peso: 3 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(8)
    expect(result.nome).toBe("Four of a Kind")
  })

  // 7. Full House
  // Uma trinca e um par
  it("should evaluate a Full House correctly", () => {
    const hand: card[] = [
      { id: "KC", valor: "K", naipe: "C", peso: 13 },
      { id: "KE", valor: "K", naipe: "E", peso: 13 },
      { id: "KO", valor: "K", naipe: "O", peso: 13 }, // Trinca de Reis
      { id: "7C", valor: "7", naipe: "C", peso: 7 },
      { id: "7E", valor: "7", naipe: "E", peso: 7 }, // Par de 7
      { id: "2O", valor: "2", naipe: "O", peso: 2 },
      { id: "4P", valor: "4", naipe: "P", peso: 4 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(7)
    expect(result.nome).toBe("Full House")
  })

  // 6. Flush
  // 5 cartas do mesmo naipe (sem sequência)
  it("should evaluate a Flush correctly", () => {
    const hand: card[] = [
      { id: "AO", valor: "A", naipe: "O", peso: 14 },
      { id: "JO", valor: "J", naipe: "O", peso: 11 },
      { id: "8O", valor: "8", naipe: "O", peso: 8 },
      { id: "4O", valor: "4", naipe: "O", peso: 4 },
      { id: "2O", valor: "2", naipe: "O", peso: 2 },
      { id: "KS", valor: "K", naipe: "E", peso: 13 }, // Naipe diferente
      { id: "5C", valor: "5", naipe: "C", peso: 5 }, // Naipe diferente
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(6)
    expect(result.nome).toBe("Flush")
  })

  // 5. Straight (Sequência)
  // 5 cartas em sequência numérica (naipes variados)
  it("should evaluate a Straight correctly", () => {
    const hand: card[] = [
      { id: "6C", valor: "6", naipe: "C", peso: 6 },
      { id: "5E", valor: "5", naipe: "E", peso: 5 },
      { id: "4O", valor: "4", naipe: "O", peso: 4 },
      { id: "3P", valor: "3", naipe: "P", peso: 3 },
      { id: "2C", valor: "2", naipe: "C", peso: 2 },
      { id: "KC", valor: "K", naipe: "C", peso: 13 },
      { id: "JC", valor: "J", naipe: "E", peso: 11 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(5)
    expect(result.nome).toBe("Straight")
  })

  // 5.1 Wheel Straight (Sequência começando no Ás)
  // 5 cartas em sequência numérica (naipes variados)
  it("should evaluate a Straight correctly", () => {
    const hand: card[] = [
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
      { id: "2E", valor: "2", naipe: "E", peso: 2 },
      { id: "3O", valor: "3", naipe: "O", peso: 3 },
      { id: "4P", valor: "4", naipe: "P", peso: 4 },
      { id: "5C", valor: "5", naipe: "C", peso: 5 },
      { id: "KC", valor: "K", naipe: "C", peso: 13 },
      { id: "2C", valor: "2", naipe: "E", peso: 2 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(5)
    expect(result.nome).toBe("Straight")
  })

  // 5.2 Straight High card
  it("should evaluate the highest Straight in a hand correctly", () => {
    const hand: card[] = [
      { id: "9C", valor: "9", naipe: "C", peso: 9 },
      { id: "8E", valor: "8", naipe: "E", peso: 8 },
      { id: "7O", valor: "7", naipe: "O", peso: 7 },
      { id: "6P", valor: "6", naipe: "P", peso: 6 },
      { id: "5C", valor: "5", naipe: "C", peso: 5 },
      { id: "4C", valor: "4", naipe: "C", peso: 4 },
      { id: "3C", valor: "3", naipe: "E", peso: 3 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(5)
    expect(result.nome).toBe("Straight")
    expect(result.kickers[0]).toBe(9)
  })

  // 4. Three of a Kind (Trinca)
  // Três cartas do mesmo valor
  it("should evaluate Three of a Kind correctly", () => {
    const hand: card[] = [
      { id: "QC", valor: "Q", naipe: "C", peso: 12 },
      { id: "QE", valor: "Q", naipe: "E", peso: 12 },
      { id: "QO", valor: "Q", naipe: "O", peso: 12 },
      { id: "10P", valor: "10", naipe: "P", peso: 10 },
      { id: "8C", valor: "8", naipe: "C", peso: 8 },
      { id: "5E", valor: "5", naipe: "E", peso: 5 },
      { id: "2O", valor: "2", naipe: "O", peso: 2 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(4)
    expect(result.nome).toBe("Three of a Kind")
  })

  // 3. Two Pair (Dois Pares)
  // Dois pares de valores diferentes
  it("should evaluate Two Pair correctly", () => {
    const hand: card[] = [
      { id: "JC", valor: "J", naipe: "C", peso: 11 },
      { id: "JE", valor: "J", naipe: "E", peso: 11 }, // Par de J
      { id: "4O", valor: "4", naipe: "O", peso: 4 },
      { id: "4P", valor: "4", naipe: "P", peso: 4 }, // Par de 4
      { id: "AC", valor: "A", naipe: "C", peso: 14 }, // Kicker (A)
      { id: "2E", valor: "2", naipe: "E", peso: 2 },
      { id: "9O", valor: "9", naipe: "O", peso: 9 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(3)
    expect(result.nome).toBe("Two Pair")
  })

  // 2. One Pair (Um Par)
  // Duas cartas do mesmo valor
  it("should evaluate One Pair correctly", () => {
    const hand: card[] = [
      { id: "10C", valor: "10", naipe: "C", peso: 10 },
      { id: "10E", valor: "10", naipe: "E", peso: 10 },
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
      { id: "KC", valor: "K", naipe: "E", peso: 13 },
      { id: "8O", valor: "8", naipe: "O", peso: 8 },
      { id: "5P", valor: "5", naipe: "P", peso: 5 },
      { id: "2C", valor: "2", naipe: "C", peso: 2 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(2)
    expect(result.nome).toBe("Pair")
  })

  // 1. High Card (Carta Alta)
  // Nenhuma combinação
  it("should evaluate High Card correctly", () => {
    const hand: card[] = [
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
      { id: "JC", valor: "J", naipe: "E", peso: 11 },
      { id: "9O", valor: "9", naipe: "O", peso: 9 },
      { id: "7P", valor: "7", naipe: "P", peso: 7 },
      { id: "5C", valor: "5", naipe: "C", peso: 5 },
      { id: "3E", valor: "3", naipe: "E", peso: 3 },
      { id: "2O", valor: "2", naipe: "O", peso: 2 },
    ]

    const result: result = HandEvaluator.evaluateHand(hand)

    expect(result.nivel).toBe(1)
    expect(result.nome).toBe("High Card")
  })
})
