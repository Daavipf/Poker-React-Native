import { StyleSheet, Text, View } from "react-native"

interface Props {
  style?: any
}

export default function EmptySeat({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.circle}>
        <Text style={styles.plus}>~</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    // O tamanho deve ser próximo ao do Avatar para manter a simetria
    width: 100,
    height: 70,
  },
  circle: {
    width: 60, // Um pouco menor que o avatar real
    height: 60,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)", // Branco transparente
    borderStyle: "dashed", // Borda tracejada dá a ideia de "lugar vago"
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  plus: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 24,
    fontWeight: "200",
  },
})
