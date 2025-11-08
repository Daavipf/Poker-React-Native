import { card } from "@/types/card"

export type player = {
  id: string
  nome: string
  fichas: number
  mao: card[] | []
  apostaNaRodada: number
  saiu: boolean
  allIn: boolean
  type: "JOGADOR" | "IA"
  role?: "Dealer" | "Small Blind" | "Big Blind"
}
