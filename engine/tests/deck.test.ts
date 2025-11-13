import { deck } from "@/types/deck"
import Deck from "../Deck"

describe("Deck Tests", () => {
  let deck: deck

  beforeEach(() => {
    deck = new Deck()
  })

  it("should initialize the deck with 52 cards", () => {
    expect(deck.deck.length).toBe(52)
  })

  it("should draw a random card", () => {
    deck.drawCard()
    expect(deck.iTopCard).toBe(1)
  })

  it("should draw a number of random cards", () => {
    for (let i = 0; i < 3; i++) {
      deck.drawCard()
    }
    expect(deck.iTopCard).toBe(3)
  })

  it("should clone an instance correctly", () => {
    for (let i = 0; i < 3; i++) {
      deck.drawCard()
    }
    expect(deck.iTopCard).toBe(3)

    let newDeck = deck.clone()
    expect(newDeck.deck.length).toBe(52)
    expect(newDeck.iTopCard).toBe(3)
  })
})
