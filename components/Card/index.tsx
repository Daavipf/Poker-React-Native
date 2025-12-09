import { card } from "@/types/card"
import { Text, View } from "react-native"
import { styles } from "./styles"

interface Props {
  card?: card
}

export default function Card({ card }: Props) {
  if (!card) {
    return <View style={[styles.cardContainer, styles.emptyCardSlot]}></View>
  }

  const isRed = card.naipe === "C" || card.naipe === "O"
  const textColor = isRed ? "#d32f2f" : "#212121"

  function mapCardSuit(suit: string) {
    switch (suit) {
      case "E":
        return "♠️"
      case "C":
        return "♥️"
      case "O":
        return "♦️"
      case "P":
        return "♣️"
      default:
        return "N/A"
    }
  }
  return (
    <View style={[styles.cardContainer, styles.activeCard]}>
      <Text style={{ color: textColor }}>{card.valor}</Text>
      <Text>{mapCardSuit(card.naipe)}</Text>
    </View>
  )
}
