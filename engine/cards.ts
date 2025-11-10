import { card } from "@/types/card"

const NAIPES = ["E", "C", "O", "P"]
const VALORES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

const getPeso = (valor: string) => {
  if (valor === "A") return 14
  if (valor === "K") return 13
  if (valor === "Q") return 12
  if (valor === "J") return 11
  return parseInt(valor)
}

export let baralhoInicial: card[] = []
for (const naipe of NAIPES) {
  for (const valor of VALORES) {
    baralhoInicial.push({
      id: `${valor}${naipe}`,
      valor: valor,
      naipe: naipe,
      peso: getPeso(valor),
    })
  }
}

export function getRandomCard(pool: string[]) {
  return pool[Math.floor(Math.random() * pool.length)]
}
