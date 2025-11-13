import { iplayer } from "@/types/iplayer"
import Player from "../Player"

describe("Player Tests", () => {
  let player: iplayer

  beforeEach(() => {
    player = new Player("Jogador", 100, "JOGADOR")
  })

  it("should initialize the player correctly", () => {
    expect(player.name).toBe("Jogador")
    expect(player.chips).toBe(100)
    expect(player.currentBet).toBe(0)
    expect(player.hand.length).toBe(0)
    expect(player.type).toBe("JOGADOR")
    expect(player.isFold).toBe(false)
    expect(player.isAllIn).toBe(false)
  })

  it("sould set player hand correctly", () => {
    const cards = [
      { id: "2E", valor: "2", naipe: "E", peso: 2 },
      { id: "AC", valor: "A", naipe: "C", peso: 14 },
    ]
    player.setHand(cards)
    expect(player.hand.length).toBe(2)
    expect(player.hand[0].id).toBe("2E")
    expect(player.hand[1].id).toBe("AC")
  })

  it("should process FOLD correctly", () => {
    player.fold()
    expect(player.isFold).toBe(true)
    expect(player.hand.length).toBe(0)
  })

  it("should process CALL correctly", () => {
    player.call(75)
    expect(player.chips).toBe(25)
    expect(player.currentBet).toBe(75)
  })

  it("should process RAISE correctly", () => {
    let playerBet = player.raise(25)
    expect(playerBet).toBe(75)
    expect(player.chips).toBe(25)
    expect(player.currentBet).toBe(75)
  })
})
