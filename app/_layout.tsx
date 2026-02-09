import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="mainMenu" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ title: "Game" }} />
      <Stack.Screen name="debug" options={{ title: "Debug" }} />
    </Stack>
  )
}
