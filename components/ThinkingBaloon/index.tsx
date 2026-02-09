import React, { useEffect, useRef } from "react"
import { Animated, View } from "react-native"
import { styles } from "./styles"

export default function ThinkingBalloon() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    // Animação infinita de "pulsação" nas reticências
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
      ]),
    ).start()
  }, [])

  return (
    <View style={styles.balloon}>
      <Animated.Text style={[styles.dots, { opacity: fadeAnim }]}>...</Animated.Text>
    </View>
  )
}
