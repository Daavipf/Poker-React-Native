import { table } from "@/types/table"
import { Text, View } from "react-native"
import Card from "../Card"
import { styles } from "./styles"

interface Props {
  table: table
}

export default function Table({ table }: Props) {
  const slots = Array.from({ length: 5 }, (_, i) => i)

  return (
    <View style={styles.table}>
      <Text>Pot: {table.pot}</Text>

      <View style={styles.communityCardsContainer}>
        {slots.map((i) => {
          const cardData = table.communityCards[i]

          return <Card key={`community-card-${i}`} card={cardData} />
        })}
      </View>
      <Text>Aposta: {table.currentBet}</Text>
    </View>
  )
}
