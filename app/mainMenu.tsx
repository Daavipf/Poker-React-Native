import { useRouter } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function MainMenu() {
  const router = useRouter()
  return (
    <View style={style.container}>
      <Text style={style.title}>Este é o menu principal</Text>
      <TouchableOpacity style={style.button} onPress={() => router.navigate("/game")}>
        <Text style={style.text}>Jogar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.button} onPress={() => router.navigate("/debug")}>
        <Text style={style.text}>Debug</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.button}>
        <Text style={style.text}>Sair</Text>
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 12,
    gap: 12,
  },
  title: {
    textAlign: "center",
  },
  text: {
    color: "#FFF",
  },
  button: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4b9cffff",
    borderRadius: 8,
  },
})
