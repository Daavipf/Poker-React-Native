import { card } from "@/types/card"
import { gameState } from "@/types/gameState"
import { player } from "@/types/player"

interface action {
  type: "INICIAR_RODADA" | "ACAO_JOGADOR" | "AVANCAR_FASE"
  payload?: { move: "FOLD" | "CALL" | "RAISE"; amount?: number }
}

export function gameReducer(state: gameState, action: action) {
  switch (action.type) {
    case "INICIAR_RODADA":
      const novoBaralho = shuffleDeck(state.baralho)
      let indexAtual = 0

      const [cartasComunitarias, indexDepoisDaMesa] = setTableCards(novoBaralho, indexAtual)
      indexAtual = indexDepoisDaMesa

      const [jogadores, indexDepoisDosJogadores] = setPlayersCards(state.jogadores, novoBaralho, indexAtual)
      indexAtual = indexDepoisDosJogadores

      return { ...state, baralho: novoBaralho, deckIndex: indexAtual, cartasComunitarias, jogadores }
    case "ACAO_JOGADOR":
      const { move, amount } = action.payload!
      if (move == "FOLD") {
        console.log("Desistiu")
        return { ...state }
      }
      if (move == "CALL") {
        console.log("Pagou")
        return { ...state }
      }
      if (move == "RAISE") {
        console.log("Aumentou")
        return { ...state }
      }
      return state
    default:
      return state
  }
}

function shuffleDeck(baralho: card[]) {
  const novoBaralho = [...baralho]
  shuffle(novoBaralho)
  return novoBaralho
}

function shuffle(array: card[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

function setTableCards(novoBaralho: card[], indexInicio: number): [card[], number] {
  let cartasComunitarias = []
  let deckIndex = indexInicio
  for (let i = 0; i < 3; i++) {
    cartasComunitarias.push(novoBaralho[deckIndex++])
  }
  return [cartasComunitarias, deckIndex]
}

function setPlayersCards(jogadoresAtuais: player[], novoBaralho: card[], indexInicio: number): [player[], number] {
  let deckIndex = indexInicio
  const novosJogadores = jogadoresAtuais.map((jogador) => {
    return {
      ...jogador,
      mao: [novoBaralho[deckIndex++], novoBaralho[deckIndex++]],
      saiu: false,
      allIn: false,
      apostaAtual: 0,
    }
  })
  return [novosJogadores, deckIndex]
}
