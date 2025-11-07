import Button from "@/components/Button"
import { useRouter } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export default function MainMenu() {
  const router = useRouter()
  return (
    <View style={style.container}>
      <Text style={style.title}>Este é o menu principal</Text>
      <Button buttonTitle="Jogar" onPress={() => router.navigate("/game")} />
      <Button buttonTitle="Sair" />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
})
