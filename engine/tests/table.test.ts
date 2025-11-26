import Player from "../Player"
import Table from "../Table"

describe("Table Tests", () => {
  let table: Table

  beforeEach(() => {
    table = new Table()
  })

  it("should initialize table correctly", () => {
    expect(table.pot).toBe(0)
    expect(table.iCurrentPlayer).toBe(0)
    expect(table.iDealer).toBe(0)
    expect(table.iLastRaiser).toBe(0)
    expect(table.communityCards.length).toBe(0)
  })

  it("should set the deck cards correctly", () => {
    const cards = [
      { id: "2E", valor: "2", naipe: "E", peso: 2 },
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
      { id: "KO", valor: "K", naipe: "O", peso: 13 },
    ]

    table.addCards(cards)
    expect(table.communityCards.length).toBe(3)
    expect(table.communityCards[0].id).toBe("2E")
    expect(table.communityCards[1].id).toBe("AC")
    expect(table.communityCards[2].id).toBe("KO")
  })

  it("sould increment the pot correctly", () => {
    table.incrementPot(100)
    expect(table.pot).toBe(100)
  })

  const players = [
    new Player("Jogador 1", 100, "JOGADOR"),
    new Player("Jogador 2", 100, "IA"),
    new Player("Jogador 3", 100, "IA"),
  ]

  it("should set the next player correctly", () => {
    table.rotateToNextPlayer(players)
    expect(table.iCurrentPlayer).toBe(1)
  })

  it("should go around the table players correctly", () => {
    table.rotateToNextPlayer(players)
    table.rotateToNextPlayer(players)
    table.rotateToNextPlayer(players)
    table.rotateToNextPlayer(players)
    expect(table.iCurrentPlayer).toBe(1)
  })

  it("should account for folded players correctly", () => {
    players[1].fold()
    table.rotateToNextPlayer(players)
    expect(table.iCurrentPlayer).toBe(2)
  })

  it("should account for all-in players correctly", () => {
    players[1].allIn()
    table.rotateToNextPlayer(players)
    expect(table.iCurrentPlayer).toBe(2)
  })

  it("should set the next dealer correctly", () => {
    table.setNextDealer(players)
    expect(table.iDealer).toBe(1)
  })

  it("should set the next raiser correctly", () => {
    table.setNextRaiser(2)
    expect(table.iLastRaiser).toBe(2)
  })
})
