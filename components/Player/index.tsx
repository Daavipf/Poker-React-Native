import { player } from "@/types/player"
import { Image, StyleProp, Text, View, ViewStyle } from "react-native"
import Card from "../Card"
import ThinkingBalloon from "../ThinkingBaloon"
import { styles } from "./styles"

interface Props {
  player: player
  isTurn: boolean
  style?: StyleProp<ViewStyle>
}

export default function Player({ player, style: customStyle, isTurn = false }: Props) {
  function getPlayerRole(role: "DEALER" | "BIG_BLIND" | "SMALL_BLIND" | undefined) {
    switch (role) {
      case "DEALER":
        return "D"
      case "BIG_BLIND":
        return "BB"
      case "SMALL_BLIND":
        return "SB"
      default:
        return ""
    }
  }

  function getButtonStyle(role: "DEALER" | "BIG_BLIND" | "SMALL_BLIND" | undefined) {
    switch (role) {
      case "DEALER":
        return styles.dealerButton
      case "BIG_BLIND":
        return styles.bigBlindButton
      case "SMALL_BLIND":
        return styles.smallBlindButton
      default:
        return undefined
    }
  }

  return (
    <View style={styles.playerContainer}>
      {isTurn && player.type === "IA" && <ThinkingBalloon />}
      <View style={[styles.container, customStyle]}>
        <View>
          <Image style={styles.profile} source={require("@/assets/images/person.png")} />
          {getPlayerRole(player.role) && (
            <View style={[styles.roleButton, getButtonStyle(player.role)]}>
              <Text style={player.role === "BIG_BLIND" && styles.bigBlindText}>{getPlayerRole(player.role)}</Text>
            </View>
          )}
        </View>

        <View style={isTurn ? styles.infoActive : styles.info}>
          <Text>{player.name}</Text>
          <Text>❂ {player.chips}</Text>
        </View>
      </View>
      {player.type === "JOGADOR" && (
        <View style={styles.cardsContainer}>
          {player.hand.map((c, index) => (
            <Card key={index} card={c} hide={player.type === "IA"} />
          ))}
        </View>
      )}
    </View>
  )
}
