import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="mainMenu" />
      <Stack.Screen name="game" />
    </Stack>
  )
}
