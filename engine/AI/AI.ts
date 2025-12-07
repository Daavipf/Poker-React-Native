import { card } from "@/types/card"
import { gameState } from "@/types/gameState"
import { player } from "@/types/player"
import { table } from "@/types/table"
import { action } from "../gameReducer"
import HandEvaluator from "../HandEvaluator"
import { AIProfile, getAIProfile } from "./AIProfile"
import { DecisionContext } from "./DecisionContext"

const BEST_HAND_STRENGTH = 0.8
const MID_HAND_STRENGTH = 0.4

export default class AI {
  static decideAction(state: gameState): action {
    const player = state.players[state.table.iCurrentPlayer]
    let profile: AIProfile = getAIProfile(player.archetype!)
    let ctx: DecisionContext = this.getDecisionContext(state, player)

    let perceivedStrength = ctx.handStrength * (1 + profile.looseness * 0.1)

    if (perceivedStrength > BEST_HAND_STRENGTH) {
      const isAggressive = Math.random() < profile.aggressiveness

      if (isAggressive && ctx.toCallAmount > 0) {
        let actualRaise = this.getAllowedRaiseBet(ctx)
        return { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: actualRaise } }
      }

      return { type: "ACAO_JOGADOR", payload: { move: "CALL" } }
    }

    const mediumHandThreshold = MID_HAND_STRENGTH - profile.looseness * 0.2
    if (perceivedStrength > mediumHandThreshold && perceivedStrength > ctx.potOdds) {
      return { type: "ACAO_JOGADOR", payload: { move: "CALL" } }
    }

    const shouldBluff = Math.random() < profile.bluffFrequency
    if (shouldBluff && ctx.toCallAmount < ctx.stackSize * 0.1) {
      let actualRaise = this.getAllowedRaiseBet(ctx)
      return { type: "ACAO_JOGADOR", payload: { move: "RAISE", amount: actualRaise } }
    }

    if (ctx.toCallAmount === 0) {
      return { type: "ACAO_JOGADOR", payload: { move: "CHECK" } }
    }

    return { type: "ACAO_JOGADOR", payload: { move: "FOLD" } }
  }

  private static getDecisionContext(state: gameState, player: player): DecisionContext {
    const toCallAmount = this.getToCallAmount(state, player)

    return {
      handStrength: this.getHandStrength(player.hand, state.table.communityCards),
      potOdds: this.getPotOdds(state.table, toCallAmount),
      toCallAmount: toCallAmount,
      stackSize: player.chips,
      potSize: state.table.pot,
      phase: state.phase,
      activePlayers: this.getActivePlayers(state.players),
    }
  }

  private static getToCallAmount(state: gameState, player: player): number {
    return state.table.currentBet - player.currentBet
  }

  private static getActivePlayers(players: player[]): number {
    let count = 0
    for (const p of players) {
      if (!p.isAllIn && !p.isFold) {
        count++
      }
    }

    return count
  }

  private static getPotOdds(table: table, callAmount: number): number {
    if (table.pot + callAmount === 0) return 0
    return callAmount / (table.pot + callAmount)
  }

  private static getHandStrength(hand: card[], communityCards: card[]): number {
    if (communityCards.length === 0) {
      return this.evaluatePreFlop(hand)
    }

    const allCards = [...hand, ...communityCards]
    let baseStrength = this.evaluatePostFlop(hand, communityCards)

    let drawBonus = 0
    if (communityCards.length < 5) {
      drawBonus = HandEvaluator.getDrawBonus(allCards)
    }

    return Math.min(baseStrength + drawBonus, 0.95)
  }

  private static evaluatePreFlop(hand: card[]): number {
    // Segue a Fórmula de Chen (Bill Chen em The Mathematics of Poker)
    // Atribui um valor para a carta mais alta, e verifica se é um par ou sequência de mesmo naipe ou não
    // Também verifica as distâncias entre os valores das cartas
    // Valor máximo possível 22, mínimo 5, normalizando o valor ao final para ficar entre 0 e 1
    const sorted = [...hand].sort((a, b) => b.peso - a.peso)
    const high = sorted[0]
    const low = sorted[1]

    let score = 0

    const highPoints: Record<number, number> = { 14: 10, 13: 8, 12: 7, 11: 6 }
    score = highPoints[high.peso] || high.peso / 2

    if (high.peso === low.peso) {
      score = Math.max(5, score * 2)
      if (high.peso >= 10) score += 2
    }

    if (high.naipe === low.naipe) {
      score += 2
    }

    const gap = high.peso - low.peso
    if (gap === 1) score += 1
    else if (gap === 2) score -= 1
    else if (gap === 3) score -= 2
    else if (gap >= 4) score -= 4

    return Math.min(score / 20, 1.0)
  }

  private static evaluatePostFlop(hand: card[], communityCards: card[]): number {
    const allCards = [...hand, ...communityCards]
    const result = HandEvaluator.evaluateHand(allCards)

    switch (result.nivel) {
      case 10:
        return 1.0 // Royal Flush
      case 9:
        return 0.98 // Straight Flush
      case 8:
        return 0.95 // Quadra
      case 7:
        return 0.85 // Full House
      case 6:
        return 0.75 // Flush
      case 5:
        return 0.65 // Straight
      case 4:
        return 0.55 // Trinca
      case 3:
        return 0.45 // Dois Pares
      case 2:
        return 0.25 // Par (Depende muito do kicker, mas média 0.25)
      case 1:
        return 0.1 // High Card (Lixo)
      default:
        return 0
    }
  }

  private static getAllowedRaiseBet(ctx: DecisionContext): number {
    // Verificar isto com playtestes para ver melhor valores de apostas
    let idealRaise = Math.floor(ctx.potSize * 0.5)
    const minRaise = ctx.toCallAmount * 2

    let actualRaise = Math.max(idealRaise, minRaise)

    if (actualRaise > ctx.stackSize) {
      actualRaise = ctx.stackSize
    }

    return actualRaise
  }
}
