import { card } from "@/types/card"

export type player = {
  id: string
  nome: string
  fichas: number
  mao: card[] | []
  apostaAtual: number
  saiu: boolean
  allIn: boolean
}
