import { gameState } from "@/types/gameState"
import { Text, View } from "react-native"
import Card from "../Card"
import { styles } from "./styles"

interface Props {
  state: gameState
}

export default function Table({ state }: Props) {
  const slots = Array.from({ length: 5 }, (_, i) => i)

  return (
    <View style={styles.table}>
      <Text>Pot: {state.table.pot}</Text>
      <Text>Aposta: {state.table.currentBet}</Text>
      <View style={styles.communityCardsContainer}>
        {slots.map((i) => {
          const cardData = state.table.communityCards[i]

          return <Card key={`community-card-${i}`} card={cardData} />
        })}
      </View>
      <Text>{state.message}</Text>
    </View>
  )
}
