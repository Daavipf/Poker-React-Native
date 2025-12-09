//import User from "@/assets/images/user-circle-svgrepo-com.svg"
import { player } from "@/types/player"
import { Image, StyleProp, Text, View, ViewStyle } from "react-native"
import Card from "../Card"
import { styles } from "./styles"

interface Props {
  jogador: player
  style?: StyleProp<ViewStyle>
}

export default function Player({ jogador, style: customStyle }: Props) {
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

  if (jogador.type === "JOGADOR") {
    return (
      <View style={styles.playerContainer}>
        <View style={[styles.container, customStyle]}>
          <View>
            <Image style={styles.profile} source={require("@/assets/images/person.png")} />
            {getPlayerRole(jogador.role) && (
              <View style={[styles.roleButton, getButtonStyle(jogador.role)]}>
                <Text style={jogador.role === "BIG_BLIND" && styles.bigBlindText}>{getPlayerRole(jogador.role)}</Text>
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text>{jogador.name}</Text>
            <Text>❂ {jogador.chips}</Text>
          </View>
        </View>
        <View style={styles.cardsContainer}>
          {jogador.hand.map((c, index) => (
            <Card key={index} card={c} />
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, customStyle]}>
      <View>
        <Image style={styles.profile} source={require("@/assets/images/person.png")} />
        {getPlayerRole(jogador.role) && (
          <View style={[styles.roleButton, getButtonStyle(jogador.role)]}>
            <Text style={jogador.role === "BIG_BLIND" && styles.bigBlindText}>{getPlayerRole(jogador.role)}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text>{jogador.name}</Text>
        <Text>❂ {jogador.chips}</Text>
      </View>
    </View>
  )
}
